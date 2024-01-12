<template>
  <Modal hide-close-button>
    <template #headline>
      <div>
        <Headline size="xl" tag="h2" class="mb-4">
          {{ $t('login_page.reset_password.title') }}
        </Headline>
      </div>
    </template>

    <form>
      <ValidatedInputGroup v-slot="{ isValid }" :errors="v.password.$errors">
        <TextInput
          v-model="model.password"
          autocomplete="current-password"
          :placeholder="$t('form_fields.new_password')"
          type="password"
          :has-errors="!isValid"
          required
          :readonly="isSubmitting"
          @input="v.password.$touch"
        />
      </ValidatedInputGroup>

      <div class="flex flex-row-reverse justify-between">
        <AppButton
          :disabled="isSubmitting"
          :loading="isSubmitting"
          @click="onSubmit"
        >
          {{ $t('login_page.reset_password.submit') }}
        </AppButton>
        <AppButton
          type="tertiary"
          :disabled="isSubmitting"
          :loading="isSubmitting"
          @click="$emit('close:modal')"
        >
          {{ $t('login_page.reset_password.cancel') }}
        </AppButton>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'

defineEmits(['close:modal'])

const route = useRoute()
const { resetPasswordByHash, isSubmitting } =
  await useAuthentication('reset_password')

const validationRules = useValidationRules()

const model = reactive({ password: '' })

const rules = {
  password: {
    required: validationRules.required,
    password: validationRules.password,
  },
}

const v = useVuelidate(rules, model)

const hash = computed(() => {
  const value = route.query.hash
  const hash = Array.isArray(value) ? value[0] : value
  return hash ?? ''
})

const onSubmit = async () => {
  const isValid = await v.value.$validate()
  if (!isValid) {
    return
  }
  await resetPasswordByHash({ password: model.password, hash: hash.value })
}
</script>
