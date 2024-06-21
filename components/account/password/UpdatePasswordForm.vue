<template>
  <div class="pt-0 text-center">
    <form
      ref="passwordUpdateForm"
      class="mx-auto mt-8 flex w-full flex-col md:mx-0 lg:w-[400px]"
    >
      <h3 class="mb-4 text-left text-2xl font-bold">
        {{ $t('my_account.password') }}
      </h3>
      <SFValidatedInputGroup
        v-slot="{ isValid }"
        :errors="v.oldPassword.$errors"
      >
        <SFTextInput
          v-model="payload.oldPassword"
          :placeholder="$t('form_fields.old_password')"
          :has-errors="!isValid"
          type="password"
          autocomplete="current-password"
          required
          @input="v.oldPassword.$touch"
        />
      </SFValidatedInputGroup>
      <SFValidatedInputGroup
        v-slot="{ isValid }"
        :errors="v.newPassword.$errors"
        class="!h-28"
      >
        <SFTextInput
          v-model="payload.newPassword"
          :placeholder="$t('form_fields.new_password')"
          :has-errors="!isValid"
          type="password"
          autocomplete="new-password"
          required
          @input="v.newPassword.$touch"
        />
        <PasswordMeter :value="payload.newPassword" class="mx-4 mb-2 mt-3" />
      </SFValidatedInputGroup>
      <SFValidatedInputGroup
        v-slot="{ isValid }"
        :errors="v.repeatedPassword.$errors"
      >
        <SFTextInput
          v-model="payload.repeatedPassword"
          :placeholder="$t('form_fields.repeated_password')"
          :has-errors="!isValid"
          type="password"
          autocomplete="new-password"
          required
          @input="v.repeatedPassword.$touch"
        />
      </SFValidatedInputGroup>
      <div class="mt-2 flex w-full items-center justify-center">
        <SFButton
          class="w-full capitalize md:w-auto md:min-w-[50%]"
          :disabled="v.$error || isUpdating"
          @click="updateUserPassword"
        >
          {{ $t('my_account.user.update_password_label') }}
        </SFButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { sleep } from 'radash'
import useVuelidate from '@vuelidate/core'
import { useToast, useValidationRules } from '~/composables'
import { useNuxtApp } from '#app/nuxt'
import { useUser } from '#storefront/composables'

const { updatePassword, fetch: refresh } = await useUser()
const { $i18n } = useNuxtApp()
const validationRules = useValidationRules()

const toast = useToast()

const initPayload = () => ({
  oldPassword: '',
  newPassword: '',
  repeatedPassword: '',
})

const isUpdating = ref(false)
const resetState = ref(false)
const payload = reactive(initPayload())

const rules = computed(() => ({
  oldPassword: {
    required: validationRules.required,
  },
  newPassword: {
    required: validationRules.required,
    password: validationRules.password,
    maxLength: validationRules.maxLength(70),
  },
  repeatedPassword: {
    required: validationRules.required,
    sameAs: validationRules.sameAs(
      computed(() => payload.newPassword),
      $i18n.t(`form_fields.new_password`),
    ),
  },
}))

const v = useVuelidate(rules.value, payload)

const updateUserPassword = async () => {
  const isFormValid = await v.value.$validate()
  if (!isFormValid) {
    return
  }
  isUpdating.value = true

  let msg = $i18n.t('my_account.user.password_update_success')
  try {
    await updatePassword({
      oldPassword: payload.oldPassword,
      newPassword: payload.newPassword,
    })
    await refresh()
    resetForm()
  } catch (err) {
    msg = $i18n.t('my_account.user.password_update_error')
  } finally {
    toast.show(msg, 'CONFIRM')
    isUpdating.value = false

    await sleep(500)
    resetState.value = false
  }
}

watch(
  () => v.value.$errors,
  () => resetState.value && v.value.$reset(),
)

const resetForm = () => {
  Object.assign(payload, initPayload())
  resetState.value = true
  v.value.$reset()
}
</script>
