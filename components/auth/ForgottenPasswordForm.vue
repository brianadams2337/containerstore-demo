<template>
  <Modal @close="$emit('close')">
    <template #headline>
      <div>
        <Headline :is-uppercase="false" size="xl" tag="h2" class="mb-4">
          {{ $t('login_page.forget_password.title') }}
        </Headline>
        <p class="mb-4 text-sm">
          {{ $t('login_page.forget_password.description') }}
        </p>
      </div>
    </template>

    <form>
      <ValidatedInputGroup v-slot="{ isValid }" :errors="v.email.$errors">
        <TextInput
          v-model="model.email"
          autocomplete="username"
          :placeholder="$t('form_fields.email')"
          type="email"
          :has-errors="!isValid"
          required
          :readonly="isSubmitting || success"
          @input="v.email.$touch" />
      </ValidatedInputGroup>

      <div class="flex flex-row-reverse justify-between">
        <AppButton
          :disabled="isSubmitting || success"
          :loading="isSubmitting"
          @click="onSubmit()">
          {{ $t('login_page.forget_password.submit') }}
        </AppButton>
        <AppButton
          type="tertiary"
          :disabled="isSubmitting"
          :loading="isSubmitting"
          @click="$emit('close')">
          {{ $t('login_page.forget_password.cancel') }}
        </AppButton>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'

defineEmits(['close'])

const { $validation } = useNuxtApp()
const { forgotPassword, isSubmitting } =
  await useAuthentication('forgot_password')
const { lastLoggedInUser } = await useLastLoggedInUser()

const success = ref(false)
const model = reactive({
  email: '',
})

const onSubmit = async () => {
  // validate all inputs
  const isValid = await v.value.$validate()
  if (isValid) {
    success.value = await forgotPassword({ email: model.email })
  }
}

watch(lastLoggedInUser, (user) => {
  model.email = user.email
})

const v = useVuelidate(
  {
    email: {
      required: $validation.rule.required,
      email: $validation.rule.email,
    },
  },
  model,
)
</script>
