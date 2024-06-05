<template>
  <form>
    <div class="h-20">
      <SalutationSelect v-model="editableUser.gender" />
    </div>

    <SFValidatedInputGroup v-slot="{ isValid }" :errors="v.first_name.$errors">
      <SFTextInput
        v-model="editableUser.first_name"
        autocomplete="given-name"
        :placeholder="$t('form_fields.first_name')"
        :has-errors="!isValid"
        required
        :readonly="isSubmitting"
        @change="v.first_name.$touch()"
      />
    </SFValidatedInputGroup>

    <SFValidatedInputGroup v-slot="{ isValid }" :errors="v.last_name.$errors">
      <SFTextInput
        v-model="editableUser.last_name"
        autocomplete="family-name"
        :placeholder="$t('form_fields.last_name')"
        :has-errors="!isValid"
        required
        :readonly="isSubmitting"
        @change="v.last_name.$touch()"
      />
    </SFValidatedInputGroup>

    <SFValidatedInputGroup v-slot="{ isValid }" :errors="v.email.$errors">
      <SFTextInput
        v-model="editableUser.email"
        autocomplete="usernaasdme"
        :placeholder="$t('form_fields.email')"
        type="email"
        :has-errors="!isValid"
        required
        :readonly="isSubmitting"
        @change="v.email.$touch()"
      />
    </SFValidatedInputGroup>

    <SFValidatedInputGroup v-slot="{ isValid }" :errors="v.password.$errors">
      <SFTextInput
        v-model="editableUser.password"
        autocomplete="new-password"
        :placeholder="$t('form_fields.password')"
        type="password"
        :has-errors="!isValid"
        required
        :readonly="isSubmitting"
        @change="v.password.$touch()"
      />
    </SFValidatedInputGroup>

    <SFButton
      class="mt-3 w-full"
      :disabled="isSubmitting"
      :loading="isSubmitting"
      @click="onSubmit"
    >
      {{ $t('login_page.sign_up.submit') }}
    </SFButton>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import useVuelidate from '@vuelidate/core'
import type { Gender } from '@scayle/storefront-nuxt'
import { useAuthentication, useValidationRules } from '~/composables'

const { register, isSubmitting } = await useAuthentication('sign_up')
const validationRules = useValidationRules()

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
      required: validationRules.required,
      maxLength: validationRules.maxLength(30),
    },
    last_name: {
      required: validationRules.required,
      maxLength: validationRules.maxLength(50),
    },
    email: {
      required: validationRules.required,
      email: validationRules.email,
    },
    password: {
      required: validationRules.required,
      password: validationRules.password,
    },
  },
  editableUser,
)
</script>
