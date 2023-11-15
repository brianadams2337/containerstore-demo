<template>
  <form>
    <div class="h-16">
      <SalutationSelect v-model="editableUser.gender" />
    </div>

    <ValidatedInputGroup v-slot="{ isValid }" :errors="v.email.$errors">
      <TextInput
        v-model="editableUser.email"
        autocomplete="username"
        :placeholder="$t('form_fields.email')"
        type="email"
        :has-errors="!isValid"
        required
        :readonly="isSubmitting"
        @change="v.email.$touch()" />
    </ValidatedInputGroup>

    <ValidatedInputGroup v-slot="{ isValid }" :errors="v.first_name.$errors">
      <TextInput
        v-model="editableUser.first_name"
        autocomplete="given-name"
        :placeholder="$t('form_fields.first_name')"
        :has-errors="!isValid"
        required
        :readonly="isSubmitting"
        @change="v.email.$touch()" />
    </ValidatedInputGroup>

    <ValidatedInputGroup v-slot="{ isValid }" :errors="v.last_name.$errors">
      <TextInput
        v-model="editableUser.last_name"
        autocomplete="family-name"
        :placeholder="$t('form_fields.last_name')"
        :has-errors="!isValid"
        required
        :readonly="isSubmitting"
        @change="v.email.$touch()" />
    </ValidatedInputGroup>

    <AppButton
      class="w-full"
      :disabled="isSubmitting"
      :loading="isSubmitting"
      @click="onSubmit()">
      {{ $t('login_page.guest_login.submit') }}
    </AppButton>
  </form>
</template>

<script setup lang="ts">
import type { Gender } from '@scayle/storefront-nuxt'
import useVuelidate from '@vuelidate/core'

const { guestLogin, isSubmitting } = await useAuthentication('guest_login')
const { $validation } = useNuxtApp()

const editableUser = reactive({
  gender: 'f' as Gender,
  first_name: '',
  last_name: '',
  email: '',
})

const v = useVuelidate(
  {
    first_name: {
      required: $validation.rule.required,
      maxLength: $validation.rule.maxLength(30),
    },
    last_name: {
      required: $validation.rule.required,
      maxLength: $validation.rule.maxLength(50),
    },
    email: {
      required: $validation.rule.required,
      email: $validation.rule.email,
    },
  },
  editableUser,
)

const onSubmit = async () => {
  const isValid = await v.value.$validate()
  isValid && (await guestLogin(editableUser))
}
</script>
