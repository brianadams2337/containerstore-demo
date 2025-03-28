<template>
  <div
    class="flex flex-col items-start gap-1 rounded-xl border border-gray-300 bg-white px-4 py-5 text-gray-600"
  >
    <SFHeadline
      class="mb-2 !font-semi-bold-variable text-primary"
      tag="h3"
      size="lg"
      data-testid="profile-password-headline"
    >
      {{ $t('my_account.profile.password.title') }}
    </SFHeadline>
    <p class="mb-6 text-md">{{ description }}</p>
    <form
      v-if="v && !isIDPUser"
      ref="passwordUpdateForm"
      class="flex w-full flex-col"
      data-testid="password-update-form"
      @submit.prevent="onSubmit"
    >
      <SFErrorMessageContainer
        data-testid="password-error-message-container"
        :message="errorMessage"
        class="mb-8"
      />
      <!-- https://www.chromium.org/developers/design-documents/create-amazing-password-forms/#use-hidden-fields-for-implicit-information -->
      <input hidden type="text" autocomplete="username" :value="user?.id" />
      <SFValidatedInputGroup
        v-slot="{ isValid }"
        :errors="v.oldPassword.$errors"
      >
        <SFPasswordInput
          v-model="payload.oldPassword"
          :is-valid="isValid"
          :placeholder="$t('form_fields.old_password')"
          autocomplete="current-password"
          data-testid="current-password"
          @input="v.oldPassword.$touch"
        />
      </SFValidatedInputGroup>
      <SFValidatedInputGroup
        v-slot="{ isValid }"
        :errors="v.newPassword.$errors"
        class="h-26 lg:h-24"
      >
        <SFPasswordInput
          v-model="payload.newPassword"
          :is-valid="isValid"
          :placeholder="$t('form_fields.new_password')"
          autocomplete="new-password"
          data-testid="new-password"
          @input="v.newPassword.$touch"
        />
      </SFValidatedInputGroup>
      <SFButton
        :loading="isUpdating"
        data-testid="update-password-submit"
        :disabled="v.$error || isUpdating"
        type="submit"
        class="self-start"
      >
        {{ $t('my_account.profile.save_label') }}
      </SFButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { FetchError } from 'ofetch'
import SFErrorMessageContainer from '../SFErrorMessageContainer.vue'
import { useToast, useValidationRules } from '~/composables'
import { useUser } from '#storefront/composables'
import {
  SFValidatedInputGroup,
  SFButton,
  SFHeadline,
} from '#storefront-ui/components'
import { useI18n } from '#i18n'
import SFPasswordInput from '~/components/form/SFPasswordInput.vue'
import { PASSWORD_MIN_LENGTH } from '~/constants/password'

const { updatePassword, user } = useUser()
const { t } = useI18n()
const validationRules = useValidationRules()

const toast = useToast()

const initPayload = () => ({
  oldPassword: '',
  newPassword: '',
})

// Using `reactive` instead of `ref` for forms with multiple inputs.
// While both `ref` and `reactive` can achieve reactivity with objects, `reactive`
// is specifically optimized for managing collections of reactive properties,
// making it a more natural and efficient choice for complex forms.
const payload = reactive(initPayload())
const isUpdating = ref(false)
const errorMessage = ref<string | null>(null)

const isIDPUser = computed(
  () => user.value?.authentication?.type !== 'password',
)

const description = computed(() => {
  return isIDPUser.value
    ? t('my_account.profile.password.idp_description')
    : t('my_account.profile.password.description')
})

const rules = computed(() => ({
  oldPassword: {
    required: validationRules.required,
  },
  newPassword: {
    required: validationRules.required,
    password: validationRules.password,
    minLength: validationRules.minLength(PASSWORD_MIN_LENGTH),
  },
}))

const v = useVuelidate(rules.value, payload)

const onSubmit = async () => {
  const isValid = await v.value.$validate()
  if (!isValid) {
    return
  }
  isUpdating.value = true

  try {
    await updatePassword(payload)
    resetForm()

    toast.show(t('my_account.profile.password.success_message'), {
      type: 'SUCCESS',
      action: 'CONFIRM',
    })
  } catch (error) {
    handleError(error)
  } finally {
    isUpdating.value = false
  }
}

const handleError = (error: unknown) => {
  const HttpErrorMessages: Readonly<Record<number, string>> = {
    400: '400_bad_request',
    401: '401_unauthorized',
    403: '403_forbidden',
  }
  if (!(error instanceof FetchError)) {
    return
  }

  const status = error.response?.status

  if (status && Object.hasOwn(HttpErrorMessages, status)) {
    errorMessage.value = t(
      `my_account.profile.password.error.${HttpErrorMessages[status]}`,
    )
  }
}

const resetForm = () => {
  Object.assign(payload, initPayload())
  errorMessage.value = null
  v.value.$reset()
}
</script>
