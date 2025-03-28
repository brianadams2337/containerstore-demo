<template>
  <form @submit.prevent="onSubmit">
    <SFErrorMessageContainer
      data-testid="reset-password-error-message-container"
      :message="errorMessage"
      class="mb-8"
    />
    <SFValidatedInputGroup
      v-slot="{ isValid }"
      :errors="v.password.$errors"
      class="h-26"
    >
      <SFPasswordInput
        v-model="password"
        :is-valid="isValid"
        :placeholder="$t('form_fields.new_password')"
        autocomplete="new-password"
        data-testid="new-password"
        @input="v.password.$touch()"
      />
    </SFValidatedInputGroup>
    <SFButton
      :disabled="isSubmitting"
      type="submit"
      class="grow"
      is-full-width
      data-testid="submit-new-password"
    >
      {{ $t('sign_in_page.reset_password.submit') }}
    </SFButton>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import SFErrorMessageContainer from '../../SFErrorMessageContainer.vue'
import SFPasswordInput from '../../form/SFPasswordInput.vue'
import { useValidationRules, useAuthentication } from '~/composables'
import { SFButton, SFValidatedInputGroup } from '#storefront-ui/components'
import { PASSWORD_MIN_LENGTH } from '~/constants/password'
import { useRoute } from '#app/composables/router'

const emit = defineEmits<{ close: [] }>()

const route = useRoute()

const { resetPasswordByHash, isSubmitting, errorMessage } =
  useAuthentication('reset_password')

const validationRules = useValidationRules()

const password = ref('')

const v = useVuelidate(
  {
    password: {
      required: validationRules.required,
      password: validationRules.password,
      minLength: validationRules.minLength(PASSWORD_MIN_LENGTH),
    },
  },
  { password },
)

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
  await resetPasswordByHash({ password: password.value, hash: token.value })
  if (!errorMessage.value) {
    emit('close')
  }
}
</script>
