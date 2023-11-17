<template>
  <form>
    <div class="h-16">
      <SalutationSelect v-model="editableUser.gender" />
    </div>

    <ValidatedInputGroup v-slot="{ isValid }" :errors="v.first_name.$errors">
      <TextInput
        v-model="editableUser.first_name"
        autocomplete="given-name"
        :placeholder="$t('form_fields.first_name')"
        :has-errors="!isValid"
        required
        :readonly="isSubmitting"
        @change="v.email.$touch()"
      />
    </ValidatedInputGroup>

    <ValidatedInputGroup v-slot="{ isValid }" :errors="v.last_name.$errors">
      <TextInput
        v-model="editableUser.last_name"
        autocomplete="family-name"
        :placeholder="$t('form_fields.last_name')"
        :has-errors="!isValid"
        required
        :readonly="isSubmitting"
        @change="v.email.$touch()"
      />
    </ValidatedInputGroup>

    <ValidatedInputGroup v-slot="{ isValid }" :errors="v.email.$errors">
      <TextInput
        v-model="editableUser.email"
        autocomplete="usernaasdme"
        :placeholder="$t('form_fields.email')"
        type="email"
        :has-errors="!isValid"
        required
        :readonly="isSubmitting"
        @change="v.email.$touch()"
      />
    </ValidatedInputGroup>

    <ValidatedInputGroup v-slot="{ isValid }" :errors="v.password.$errors">
      <TextInput
        v-model="editableUser.password"
        autocomplete="new-password"
        :placeholder="$t('form_fields.password')"
        type="password"
        :has-errors="!isValid"
        required
        :readonly="isSubmitting"
        @change="v.email.$touch()"
      />
    </ValidatedInputGroup>

    <AppButton
      class="mt-3 w-full"
      :disabled="isSubmitting"
      :loading="isSubmitting"
      @click="onSubmit"
    >
      {{ $t('login_page.sign_up.submit') }}
    </AppButton>
  </form>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import type { Gender } from '@scayle/storefront-nuxt'

const { register, isSubmitting } = await useAuthentication('sign_up')
const { $validation } = useNuxtApp()

const editableUser = reactive({
  gender: 'f' as Gender,
  first_name: '',
  last_name: '',
  email: '',
  password: '',
})

const onSubmit = async () => {
  // validate all inputs
  if (await v.value.$validate()) {
    await register(editableUser)
  }
}

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
    password: {
      required: $validation.rule.required,
      password: $validation.rule.password,
    },
  },
  editableUser,
)
</script>
