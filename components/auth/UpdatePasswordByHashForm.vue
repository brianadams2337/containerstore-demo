<template>
  <SFModal hide-close-button>
    <template #headline>
      <div>
        <SFHeadline size="xl" tag="h2" class="mb-4">
          {{ $t('login_page.reset_password.title') }}
        </SFHeadline>
      </div>
    </template>

    <form>
      <SFValidatedInputGroup v-slot="{ isValid }" :errors="v.password.$errors">
        <SFTextInput
          v-model="model.password"
          autocomplete="current-password"
          :placeholder="$t('form_fields.new_password')"
          type="password"
          :has-errors="!isValid"
          required
          :readonly="isSubmitting"
          @input="v.password.$touch"
        />
      </SFValidatedInputGroup>

      <div class="flex flex-row-reverse justify-between">
        <SFButton
          :disabled="isSubmitting"
          :loading="isSubmitting"
          @click="onSubmit"
        >
          {{ $t('login_page.reset_password.submit') }}
        </SFButton>
        <SFButton
          type="tertiary"
          :disabled="isSubmitting"
          :loading="isSubmitting"
          @click="$emit('close:modal')"
        >
          {{ $t('login_page.reset_password.cancel') }}
        </SFButton>
      </div>
    </form>
  </SFModal>
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
