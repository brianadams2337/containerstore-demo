<template>
  <div
    class="flex flex-col items-start gap-1 rounded-xl border border-gray-300 bg-white px-4 py-5 text-gray-600"
  >
    <SFHeadline
      class="mb-2 !font-semi-bold-variable text-primary"
      tag="h3"
      size="lg"
      data-testid="profile-personal-information-headline"
    >
      {{ $t('my_account.profile.personal_information.title') }}
    </SFHeadline>
    <p class="mb-6 text-md">
      {{ $t('my_account.profile.personal_information.description') }}
    </p>
    <form
      v-if="v"
      ref="personalInfoForm"
      class="flex w-full flex-col"
      data-testid="personal-info-form"
      @submit.prevent="onSubmit"
      @keydown.enter.prevent="onEnter"
    >
      <SFErrorMessageContainer
        data-testid="personal-info-error-message-container"
        :message="errorMessage"
        class="mb-8"
      />
      <SFValidatedInputGroup v-slot="{ isValid }" :errors="v.gender.$errors">
        <SFGenderSelection
          v-model="payload.gender"
          :disabled="isUpdating"
          :is-valid="isValid"
        />
      </SFValidatedInputGroup>
      <SFValidatedInputGroup v-slot="{ isValid }" :errors="v.firstName.$errors">
        <SFTextInput
          v-model="payload.firstName"
          autocomplete="given-name"
          :placeholder="$t('form_fields.first_name')"
          :has-errors="!isValid"
          required
          :readonly="isUpdating"
          data-testid="user-first-name"
          @change="v.firstName.$touch()"
        />
      </SFValidatedInputGroup>
      <SFValidatedInputGroup v-slot="{ isValid }" :errors="v.lastName.$errors">
        <SFTextInput
          v-model="payload.lastName"
          autocomplete="family-name"
          :placeholder="$t('form_fields.last_name')"
          :has-errors="!isValid"
          required
          :readonly="isUpdating"
          data-testid="user-last-name"
          @change="v.lastName.$touch()"
        />
      </SFValidatedInputGroup>
      <SFValidatedInputGroup
        v-slot="{ isValid }"
        :errors="v.birthDate.$errors"
        data-testid="section-birthdate"
      >
        <SFTextInput
          v-model="payload.birthDate"
          :placeholder="dateOfBirthFormat.placeholder"
          :mask="dateOfBirthFormat.mask"
          :has-errors="!isValid"
          data-testid="user-birthdate"
          @change="v.birthDate.$touch()"
        />
      </SFValidatedInputGroup>
      <SFButton
        :loading="isUpdating"
        :disabled="v.$error || isUpdating"
        data-testid="personal-info-submit"
        type="submit"
        class="self-start"
      >
        {{ $t('my_account.profile.save_label') }}
      </SFButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef, computed, reactive, ref, watch } from 'vue'
import useVuelidate from '@vuelidate/core'
import SFErrorMessageContainer from '../SFErrorMessageContainer.vue'
import SFGenderSelection from '../form/SFGenderSelection.vue'
import { useUser, useCurrentShop } from '#storefront/composables'
import {
  SFHeadline,
  SFButton,
  SFValidatedInputGroup,
  SFTextInput,
} from '#storefront-ui/components'
import { dateOfBirthFormats } from '~/constants/mask'
import { useToast, useValidationRules } from '~/composables'
import { useI18n } from '#i18n'

const { updateUser, user } = useUser()

const { t } = useI18n()
const currentShop = useCurrentShop()
const validationRules = useValidationRules()

const toast = useToast()

const dateOfBirthFormat = computed(() => {
  const locale = currentShop.value?.locale.replace('-', '_')
  return (locale && dateOfBirthFormats[locale]) || dateOfBirthFormats.de_DE
})

const formatBirthDate = (date?: string): string => {
  const parts = date?.split('T')[0]?.split('-')

  if (!parts || parts.length !== 3) {
    return ''
  }

  const [yyyy, mm, dd] = parts
  return `${dd}.${mm}.${yyyy}`
}

// Initializes and keeps the payload in sync with the user data
const initPayload = () => ({
  firstName: user.value?.firstName ?? '',
  lastName: user.value?.lastName ?? '',
  email: user.value?.email ?? '',
  birthDate: formatBirthDate(user.value?.birthDate),
  gender: user.value?.gender,
})

// Using `reactive` instead of `ref` for forms with multiple inputs.
// While both `ref` and `reactive` can achieve reactivity with objects, `reactive`
// is specifically optimized for managing collections of reactive properties,
// making it a more natural and efficient choice for complex forms.
const payload = reactive(initPayload())

const isUpdating = ref(false)

const errorMessage = ref<string | null>(null)

const rules = computed(() => ({
  gender: {
    required: validationRules.required,
  },
  firstName: {
    name: validationRules.name,
    required: validationRules.required,
  },
  lastName: {
    name: validationRules.name,
    required: validationRules.required,
  },
  birthDate: {
    date: validationRules.date,
    futureDate: validationRules.futureDate,
  },
}))

const v = useVuelidate(rules.value, payload)

const personalInfoForm = useTemplateRef('personalInfoForm')

/**
 * Handles the Enter key press event on form elements to prevent unintended behavior.
 *
 * - If the current element is a button, it triggers the button's click event.
 * - If there is a next element, it moves focus to the next element.
 * - If no next element exists, it submits the form.
 *
 * This ensures smoother navigation and interaction within the form, especially for elements like dropdowns.
 *
 * @param {KeyboardEvent} event - The keyboard event triggered by pressing the Enter key.
 */
const onEnter = (event: KeyboardEvent) => {
  const formElements = Array.from(
    personalInfoForm?.value?.elements ?? [],
  ) as HTMLElement[]
  const currentIndex = formElements.indexOf(event.target as HTMLElement)
  const currentElement = formElements[currentIndex]
  const nextElement = formElements[currentIndex + 1]

  const isCurrentElementButton = currentElement.tagName === 'BUTTON'

  if (isCurrentElementButton) {
    return currentElement.click()
  }

  if (nextElement) {
    return nextElement.focus()
  }

  onSubmit()
}

const onSubmit = async () => {
  isUpdating.value = true

  try {
    const isValid = await v.value.$validate()
    if (!isValid) {
      return
    }

    const [firstPart, secondPart, thirdPart] = payload.birthDate.split('.')

    await updateUser({
      ...payload,
      birthDate: payload.birthDate
        ? `${thirdPart}-${secondPart}-${firstPart}`
        : undefined,
    })
    toast.show(t('my_account.profile.personal_information.success_message'), {
      type: 'SUCCESS',
      action: 'CONFIRM',
    })
    errorMessage.value = null
  } catch {
    errorMessage.value = t(
      'my_account.profile.personal_information.error_message',
    )
  } finally {
    isUpdating.value = false
  }
}

watch(user, () => Object.assign(payload, initPayload()), { immediate: true })
</script>
