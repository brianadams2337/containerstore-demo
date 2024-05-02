<template>
  <SFModal @close="$emit('close:modal')">
    <template #headline>
      <div>
        <SFHeadline size="xl" tag="h2" class="mb-4">
          {{ $t('login_page.forgot_password.title') }}
        </SFHeadline>
        <p class="mb-4 text-sm">
          {{ $t('login_page.forgot_password.description') }}
        </p>
      </div>
    </template>
    <form>
      <SFValidatedInputGroup v-slot="{ isValid }" :errors="v.email.$errors">
        <SFTextInput
          v-model="model.email"
          autocomplete="username"
          :placeholder="$t('form_fields.email')"
          type="email"
          :has-errors="!isValid"
          required
          :readonly="isSubmitting || success"
          @input="v.email.$touch"
        />
      </SFValidatedInputGroup>

      <div class="flex flex-row-reverse justify-between">
        <SFButton
          :disabled="isSubmitting || success"
          :loading="isSubmitting"
          @click="onSubmit()"
        >
          {{ $t('login_page.forgot_password.submit') }}
        </SFButton>
        <SFButton
          type="tertiary"
          :disabled="isSubmitting"
          :loading="isSubmitting"
          @click="$emit('close:modal')"
        >
          {{ $t('login_page.forgot_password.cancel') }}
        </SFButton>
      </div>
    </form>
  </SFModal>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'

defineEmits(['close:modal'])

const { forgotPassword, isSubmitting } =
  await useAuthentication('forgot_password')
const { lastLoggedInUser } = await useLastLoggedInUser()

const validationRules = useValidationRules()

const success = ref(false)
const model = reactive({ email: '' })

const onSubmit = async () => {
  const isValid = await v.value.$validate()
  if (isValid) {
    success.value = await forgotPassword(model.email)
  }
}

watch(
  () => lastLoggedInUser.value,
  (user) => Object.assign(model.email, user.email),
)

const emailRules = {
  required: validationRules.required,
  email: validationRules.email,
}

const v = useVuelidate({ email: emailRules }, model)
</script>
