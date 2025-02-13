<template>
  <form v-if="v" class="flex flex-col" @submit.prevent="onSubmit">
    <SFAuthErrorMessageContainer
      data-testid="register-error-message-container"
      :message="errorMessage"
      class="mb-8"
    />
    <SFValidatedInputGroup v-slot="{ isValid }" :errors="v.gender.$errors">
      <SFGenderSelection
        v-model="userPayload.gender"
        :disabled="isSubmitting"
        :is-valid="isValid"
      />
    </SFValidatedInputGroup>
    <SFValidatedInputGroup v-slot="{ isValid }" :errors="v.first_name.$errors">
      <SFTextInput
        v-model="userPayload.first_name"
        autocomplete="given-name"
        :placeholder="$t('form_fields.first_name')"
        :has-errors="!isValid"
        required
        :readonly="isSubmitting"
        @change="v.first_name.$touch()"
      />
    </SFValidatedInputGroup>
    <SFValidatedInputGroup v-slot="{ isValid }" :errors="v.last_name.$errors">
      <SFTextInput
        v-model="userPayload.last_name"
        autocomplete="family-name"
        :placeholder="$t('form_fields.last_name')"
        :has-errors="!isValid"
        required
        :readonly="isSubmitting"
        @change="v.last_name.$touch()"
      />
    </SFValidatedInputGroup>
    <SFValidatedInputGroup v-slot="{ isValid }" :errors="v.email.$errors">
      <SFTextInput
        v-model="userPayload.email"
        autocomplete="email"
        :placeholder="$t('form_fields.email')"
        type="email"
        :has-errors="!isValid"
        required
        :readonly="isSubmitting"
        @change="v.email.$touch()"
      />
    </SFValidatedInputGroup>
    <SFValidatedInputGroup
      v-if="!isGuestFlowEnabled"
      v-slot="{ isValid }"
      class="h-26 sm:h-20"
      :errors="v.password.$errors"
    >
      <SFPasswordInput
        v-model="userPayload.password"
        :is-valid="isValid"
        :placeholder="$t('form_fields.password')"
        autocomplete="new-password"
        data-testid="new-password"
        @change="v.password.$touch()"
      />
    </SFValidatedInputGroup>
    <SFAuthRegisterToggleGuest v-model="isGuestFlowEnabled" />
    <div class="flex items-center justify-between">
      <SFButton
        :disabled="isSubmitting"
        :loading="isSubmitting"
        type="submit"
        data-testid="register-submit"
        class="w-1/2"
      >
        {{ $t('sign_in_page.sign_up.submit') }}
      </SFButton>
      <span class="text-xs text-gray-500">
        {{ $t('sign_in_page.sign_up.mandatory_info') }}
      </span>
    </div>
  </form>
  <SFAuthRegisterPrivacyDisclaimer class="mt-5" />
  <SFAuthSeparator v-if="externalIDPRedirects" class="my-8 lg:my-10" />
  <SFAuthIDPRedirects
    v-if="externalIDPRedirects"
    :redirects="externalIDPRedirects"
  />
  <p
    class="text-start text-base text-gray-600"
    :class="{ 'mt-8': !externalIDPRedirects }"
  >
    {{ $t('sign_in_page.sign_up.not_new_user') }}
    <SFLocalizedLink
      :to="routeList.signin"
      raw
      class="rounded-md p-1 py-0.5 font-semibold hover:bg-gray-100"
    >
      {{ $t('sign_in_page.sign_up.go_to_login') }} </SFLocalizedLink
    >.
  </p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import type { Gender } from '@scayle/storefront-nuxt'
import type { Required } from 'utility-types'
import SFPasswordInput from '../SFPasswordInput.vue'
import SFGenderSelection from '../SFGenderSelection.vue'
import SFAuthErrorMessageContainer from '../SFAuthErrorMessageContainer.vue'
import SFAuthIDPRedirects from '../SFAuthIDPRedirects.vue'
import SFAuthRegisterPrivacyDisclaimer from './SFAuthRegisterPrivacyDisclaimer.vue'
import SFAuthRegisterToggleGuest from './SFAuthRegisterToggleGuest.vue'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'
import { useValidationRules, useAuthentication } from '~/composables'
import { routeList } from '~/utils'
import {
  SFButton,
  SFTextInput,
  SFValidatedInputGroup,
} from '#storefront-ui/components'
import SFAuthSeparator from '~/components/auth/SFAuthSeparator.vue'
import { PASSWORD_MIN_LENGTH } from '~/constants/password'

defineProps<{ externalIDPRedirects?: Record<string, string> }>()

const isGuestFlowEnabled = ref(false)

const { register, isSubmitting, guestLogin, errorMessage } = useAuthentication(
  isGuestFlowEnabled.value ? 'sign_up' : 'guest_login',
)
const validationRules = useValidationRules()

type UserPayload = {
  gender?: Gender
  first_name: string
  last_name: string
  email: string
  password: string
}

const userPayload = ref<UserPayload>({
  gender: undefined,
  first_name: '',
  last_name: '',
  email: '',
  password: '',
})

const validateForm = async (): Promise<boolean> => {
  await v.value.$validate()
  // Exclude password validation for guest flow; otherwise, validate all fields
  return isGuestFlowEnabled.value
    ? v.value.$errors.every((item) => item.$property === 'password')
    : !v.value.$errors.length
}

const onSubmit = async () => {
  const isValid = await validateForm()

  if (!isValid) {
    return
  }

  const { password, ...payload } = userPayload.value

  if (isGuestFlowEnabled.value) {
    await guestLogin(payload as Required<Omit<UserPayload, 'password'>>)
  } else {
    await register({ ...payload, password } as Required<UserPayload>)
  }
}

const v = useVuelidate(
  {
    gender: {
      required: validationRules.required,
    },
    first_name: {
      required: validationRules.required,
      name: validationRules.name,
    },
    last_name: {
      required: validationRules.required,
      name: validationRules.name,
    },
    email: {
      required: validationRules.required,
      email: validationRules.email,
    },
    password: {
      required: validationRules.required,
      password: validationRules.password,
      minLength: validationRules.minLength(PASSWORD_MIN_LENGTH),
    },
  },
  userPayload.value as Required<UserPayload>,
)
</script>
