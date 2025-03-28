<template>
  <form
    v-if="v"
    class="flex flex-col"
    data-testid="login-form"
    @submit.prevent="onSubmit"
  >
    <SFErrorMessageContainer
      data-testid="login-error-message-container"
      :message="errorMessage"
      class="mb-8"
    />
    <SFValidatedInputGroup v-slot="{ isValid }" :errors="v.email.$errors">
      <SFTextInput
        v-model="userPayload.email"
        autocomplete="email"
        :placeholder="$t('form_fields.email')"
        type="email"
        name="login-email"
        :has-errors="!isValid"
        required
        :readonly="isSubmitting"
        data-testid="login-email"
        @change="v.email.$touch()"
      />
    </SFValidatedInputGroup>
    <SFValidatedInputGroup
      v-slot="{ isValid }"
      :errors="v.password.$errors"
      class="h-26 sm:h-22"
    >
      <SFPasswordInput
        v-model="userPayload.password"
        :is-valid="isValid"
        :disabled="isSubmitting"
        name="login-password"
        data-testid="login-password"
        autocomplete="current-password"
        :placeholder="$t('form_fields.password')"
        @change="v.password.$touch()"
      />
    </SFValidatedInputGroup>
    <div class="flex items-center justify-between">
      <SFButton
        :disabled="isSubmitting"
        :loading="isSubmitting"
        type="submit"
        data-testid="login-submit"
        class="w-1/2"
      >
        {{ $t('sign_in_page.login.submit') }}
      </SFButton>
      <SFAuthForgotPassword
        :prefilled-email="prefilledEmailForForgotPassword"
      />
    </div>
  </form>
  <SFAuthSeparator v-if="externalIDPRedirects" class="my-8 lg:my-10" />
  <SFAuthIDPRedirects
    v-if="externalIDPRedirects"
    :redirects="externalIDPRedirects"
  />
  <p
    class="text-start text-base text-gray-600"
    data-testid="create-account-label"
    :class="{ 'mt-8': !externalIDPRedirects }"
  >
    {{ $t('sign_in_page.login.not_user_yet') }}
    <SFLocalizedLink
      :to="routeList.signup"
      raw
      class="rounded-md px-1.5 py-0.5 font-semibold hover:bg-gray-100"
      data-testid="signin-page-link"
    >
      {{ $t('sign_in_page.login.create_account') }}
    </SFLocalizedLink>
  </p>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import SFLocalizedLink from '../SFLocalizedLink.vue'
import SFErrorMessageContainer from '../SFErrorMessageContainer.vue'
import SFPasswordInput from '../form/SFPasswordInput.vue'
import SFAuthIDPRedirects from './SFAuthIDPRedirects.vue'
import SFAuthForgotPassword from './forgotPassword/SFAuthForgotPassword.vue'
import { useValidationRules, useAuthentication } from '~/composables'
import {
  SFButton,
  SFTextInput,
  SFValidatedInputGroup,
} from '#storefront-ui/components'
import SFAuthSeparator from '~/components/auth/SFAuthSeparator.vue'
import { routeList } from '~/utils'
import { PASSWORD_MIN_LENGTH } from '~/constants/password'

defineProps<{ externalIDPRedirects?: Record<string, string> }>()

// Using `reactive` instead of `ref` for forms with multiple inputs.
// While both `ref` and `reactive` can achieve reactivity with objects, `reactive`
// is specifically optimized for managing collections of reactive properties,
// making it a more natural and efficient choice for complex forms.
const userPayload = reactive<Record<'email' | 'password', string>>({
  email: '',
  password: '',
})
const { login, isSubmitting, errorMessage } = useAuthentication('login')

const validationRules = useValidationRules()

const prefilledEmailForForgotPassword = computed(() => {
  return v.value.email.$invalid ? '' : userPayload.email
})

const rules = {
  email: {
    required: validationRules.required,
    email: validationRules.email,
  },
  password: {
    required: validationRules.required,
    password: validationRules.password,
    minLength: validationRules.minLength(PASSWORD_MIN_LENGTH),
  },
}

const v = useVuelidate(rules, userPayload)

const onSubmit = async () => {
  const isValid = await v.value.$validate()
  if (!isValid) {
    return
  }

  await login(userPayload)
}
</script>
