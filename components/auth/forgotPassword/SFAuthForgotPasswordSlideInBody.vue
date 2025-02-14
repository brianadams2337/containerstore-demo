<template>
  <form @submit.prevent="onSubmit">
    <SFAuthErrorMessageContainer
      data-testid="forgot-password-error-message-container"
      :message="errorMessage"
      class="mb-8"
    />
    <SFValidatedInputGroup v-slot="{ isValid }" :errors="v.email.$errors">
      <SFTextInput
        v-model="email"
        autocomplete="email"
        :placeholder="$t('form_fields.email')"
        type="email"
        :has-errors="!isValid"
        name="forgot-password-email"
        required
        :readonly="isSubmitting"
        data-testid="forgot-password-email"
        @change="v.email.$touch()"
      />
    </SFValidatedInputGroup>
    <div
      class="flex flex-wrap items-center justify-between gap-4 max-lg:items-start lg:flex-row"
    >
      <SFButton
        variant="raw"
        :disabled="isSubmitting"
        class="mr-7 h-6 rounded-md px-1.5 text-base font-semibold !text-gray-600 hover:bg-gray-100"
        @click.prevent="backToLogin"
      >
        <IconChevronLeft class="size-4" aria-hidden="true" />
        {{ $t('sign_in_page.forgot_password.back_to_login') }}
      </SFButton>
      <SFButton :disabled="isSubmitting" type="submit" class="grow">
        {{ $t('sign_in_page.forgot_password.submit') }}
      </SFButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { watchImmediate } from '@vueuse/core'
import SFAuthErrorMessageContainer from '../SFAuthErrorMessageContainer.vue'
import {
  useValidationRules,
  useAuthentication,
  useRouteHelpers,
} from '~/composables'
import {
  SFButton,
  SFTextInput,
  SFValidatedInputGroup,
} from '#storefront-ui/components'
import { routeList } from '~/utils'

const emit = defineEmits<{ close: [] }>()

const { prefilledEmail } = defineProps<{ prefilledEmail: string }>()

const { forgotPassword, isSubmitting, errorMessage } =
  useAuthentication('forgot_password')

const validationRules = useValidationRules()

const { localizedNavigateTo } = useRouteHelpers()

const email = ref('')

const onSubmit = async () => {
  const isValid = await v.value.$validate()
  if (!isValid) {
    return
  }
  const success = await forgotPassword(email.value)
  if (success) {
    close()
    emit('close')
  }
}

const backToLogin = async () => {
  emit('close')
  await localizedNavigateTo(routeList.signin)
}

const emailRules = {
  required: validationRules.required,
  email: validationRules.email,
}

const v = useVuelidate({ email: emailRules }, { email })

watchImmediate(
  () => prefilledEmail,
  (value) => {
    email.value = value
  },
)
</script>
