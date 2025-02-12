<template>
  <form @submit.prevent="onSubmit">
    <SFAuthErrorMessageContainer
      data-testid="reset-password-error-message-container"
      :message="errorMessage"
      class="mb-8"
    />
    <SFValidatedInputGroup
      v-slot="{ isValid }"
      :errors="v.newPassword.$errors"
      class="h-26"
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
    <SFValidatedInputGroup
      v-slot="{ isValid }"
      :errors="v.repeatedPassword.$errors"
      class="h-26"
    >
      <SFPasswordInput
        v-model="payload.repeatedPassword"
        :placeholder="$t('form_fields.repeated_password')"
        :is-valid="isValid"
        autocomplete="new-password"
        data-testid="new-password-repeat"
        @input="v.repeatedPassword.$touch"
      />
    </SFValidatedInputGroup>
    <SFButton :disabled="isSubmitting" type="submit" class="grow" is-full-width>
      {{ $t('sign_in_page.reset_password.submit') }}
    </SFButton>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import SFAuthErrorMessageContainer from '../SFAuthErrorMessageContainer.vue'
import SFPasswordInput from '../SFPasswordInput.vue'
import { useValidationRules, useAuthentication } from '~/composables'
import { SFButton, SFValidatedInputGroup } from '#storefront-ui/components'
import { PASSWORD_MIN_LENGTH } from '~/constants/password'
import { useRoute } from '#app/composables/router'
import { useI18n } from '#i18n'

defineEmits<{ close: [] }>()

const { t } = useI18n()

const route = useRoute()

const { resetPasswordByHash, isSubmitting, errorMessage } =
  useAuthentication('reset_password')

const validationRules = useValidationRules()

const payload = ref({
  newPassword: '',
  repeatedPassword: '',
})

const rules = computed(() => ({
  newPassword: {
    required: validationRules.required,
    password: validationRules.password,
    minLength: validationRules.minLength(PASSWORD_MIN_LENGTH),
  },
  repeatedPassword: {
    required: validationRules.required,
    sameAs: validationRules.sameAs(
      computed(() => payload.value.newPassword),
      t(`form_fields.new_password`),
    ),
  },
}))

const v = useVuelidate(rules, payload.value)

const token = computed(() => {
  const value = route.query.hash
  const hash = Array.isArray(value) ? value[0] : value
  return hash ?? ''
})

const onSubmit = async () => {
  const isValid = await v.value.$validate()
  if (!isValid) {
    return
  }
  await resetPasswordByHash({
    password: payload.value.newPassword,
    hash: token.value,
  })
}
</script>
