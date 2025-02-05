<template>
  <SFAsyncDataWrapper :status="status">
    <form
      class="mx-auto mt-10 flex w-full flex-col md:mx-0 lg:w-[400px]"
      data-testid="form-user-data"
    >
      <SFRadioGroup
        v-model="payload.gender"
        :items="genders"
        class="items-start"
        data-testid="radio-group-gender"
      />
      <div class="mt-8">
        <SFValidatedInputGroup
          v-slot="{ isValid }"
          :errors="v.firstName.$errors"
        >
          <SFTextInput
            v-model="payload.firstName"
            :has-errors="!isValid"
            :placeholder="$t('form_fields.first_name')"
            required
            data-testid="user-first-name"
            @input="v.firstName.$touch"
          />
        </SFValidatedInputGroup>
        <SFValidatedInputGroup
          v-slot="{ isValid }"
          :errors="v.lastName.$errors"
          data-testid="section-last-name"
        >
          <SFTextInput
            v-model="payload.lastName"
            :has-errors="!isValid"
            :placeholder="$t('form_fields.last_name')"
            required
            data-testid="user-last-name"
            @input="v.lastName.$touch"
          />
        </SFValidatedInputGroup>
        <SFValidatedInputGroup
          v-slot="{ isValid }"
          :errors="v.birthDate.$errors"
          data-testid="section-birthdate"
        >
          <SFTextInput
            v-model="payload.birthDate"
            :placeholder="dobFormat.placeholder"
            :mask="dobFormat.mask"
            :has-errors="!isValid"
            data-testid="user-birthdate"
            @input="v.birthDate.$touch"
          />
        </SFValidatedInputGroup>
        <SFTextInput
          v-model="payload.email"
          :placeholder="$t('form_fields.email')"
          :hint="$t('my_account.user.email_change_hint')"
          data-testid="user-email-address"
          readonly
        />
        <div
          class="mt-6 flex w-full items-center justify-center"
          data-testid="save-button"
        >
          <SFButton
            class="w-full capitalize md:w-auto md:min-w-[50%]"
            :disabled="isUpdating || v.$error"
            @click="update"
          >
            {{ $t('my_account.user.save_label') }}
          </SFButton>
        </div>
      </div>
    </form>
    <template #loading>
      <SFUserPersonalInfoFormSkeletonLoader :form-element-count="4" />
    </template>
  </SFAsyncDataWrapper>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { formatDate, getPayloadDate } from '@scayle/storefront-nuxt'
import useVuelidate from '@vuelidate/core'
import SFAsyncDataWrapper from '../SFAsyncDataWrapper.vue'
import SFUserPersonalInfoFormSkeletonLoader from './SFUserPersonalInfoFormSkeletonLoader.vue'
import { dateOfBirthFormats } from '~/constants/mask'
import { useToast, useValidationRules } from '~/composables'
import { useCurrentShop, useUser } from '#storefront/composables'
import {
  SFButton,
  SFValidatedInputGroup,
  SFTextInput,
  SFRadioGroup,
} from '#storefront-ui/components'
import { useI18n } from '#i18n'

const { user, updateUser, status } = useUser()

const { t } = useI18n()
const currentShop = useCurrentShop()
const validationRules = useValidationRules()

const toast = useToast()

const dobFormat = computed(() => {
  const locale = currentShop.value?.locale.replace('-', '_')
  return (locale && dateOfBirthFormats[locale]) || dateOfBirthFormats.de_DE
})

// initializes and keeps the payload in sync with the user data
const initPayload = () => ({
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || '',
  email: user.value?.email || '',
  birthDate: formatDate(user.value?.birthDate) || '',
  gender: user.value?.gender,
})

const payload = reactive(initPayload())

const isUpdating = ref(false)

const rules = computed(() => ({
  firstName: {
    name: validationRules.name,
    required: validationRules.required,
    maxLength: validationRules.maxLength(30),
  },
  lastName: {
    name: validationRules.name,
    required: validationRules.required,
    maxLength: validationRules.maxLength(50),
  },
  birthDate: {
    date: validationRules.date,
    futureDate: validationRules.futureDate,
  },
}))

const v = useVuelidate(rules.value, payload, { $scope: false })

const setPayload = () => Object.assign(payload, initPayload())

const genders = computed(() => [
  {
    label: t('form_fields.male'),
    value: 'm',
  },
  {
    label: t('form_fields.female'),
    value: 'f',
  },
  {
    label: t('form_fields.diverse'),
    value: 'd',
  },
])

watch(user, setPayload, { immediate: true })

const update = async () => {
  isUpdating.value = true

  const saveError = t('my_account.user.save_error')
  try {
    const isValid = await v.value.$validate()
    if (!isValid) {
      throw new Error(saveError)
    }
    await updateUser({
      ...payload,
      birthDate: payload.birthDate
        ? getPayloadDate(payload.birthDate)
        : undefined,
    })
    toast.show(t('my_account.user.save_message'), {
      action: 'CONFIRM',
    })
  } catch {
    toast.show(saveError, { action: 'CONFIRM' })
  } finally {
    isUpdating.value = false
  }
}
</script>
