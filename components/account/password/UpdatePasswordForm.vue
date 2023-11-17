<template>
  <div class="pt-0 text-center">
    <form
      ref="passwordUpdateForm"
      class="mx-auto mt-8 flex w-full flex-col md:mx-0 lg:w-[400px]"
    >
      <h3 class="mb-4 text-left text-2xl font-bold">
        {{ $t('my_account.password') }}
      </h3>
      <ValidatedInputGroup v-slot="{ isValid }" :errors="v.oldPassword.$errors">
        <TextInput
          v-model="payload.oldPassword"
          :placeholder="$t('form_fields.old_password')"
          :has-errors="!isValid"
          type="password"
          required
          @input="v.oldPassword.$touch"
        />
      </ValidatedInputGroup>
      <ValidatedInputGroup
        v-slot="{ isValid }"
        :errors="v.newPassword.$errors"
        class="!h-28"
      >
        <TextInput
          v-model="payload.newPassword"
          :placeholder="$t('form_fields.new_password')"
          :has-errors="!isValid"
          type="password"
          required
          @input="v.newPassword.$touch"
        />
        <PasswordMeter :value="payload.newPassword" class="mx-4 mb-2 mt-3" />
      </ValidatedInputGroup>
      <ValidatedInputGroup
        v-slot="{ isValid }"
        :errors="v.repeatedPassword.$errors"
      >
        <TextInput
          v-model="payload.repeatedPassword"
          :placeholder="$t('form_fields.repeated_password')"
          :has-errors="!isValid"
          type="password"
          required
          @input="v.repeatedPassword.$touch"
        />
      </ValidatedInputGroup>
      <div class="mt-2 flex w-full items-center justify-center">
        <AppButton
          class="w-full capitalize md:w-auto md:min-w-[50%]"
          :disabled="v.$error || isUpdating"
          @click="updateUserPassword"
        >
          {{ $t('my_account.user.update_password_label') }}
        </AppButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'

const { updatePassword, fetch: refresh } = await useUser()
const { $alert, $i18n, $validation } = useNuxtApp()

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
    required: $validation.rule.required,
  },
  newPassword: {
    required: $validation.rule.required,
    password: $validation.rule.password,
    maxLength: $validation.rule.maxLength(70),
  },
  repeatedPassword: {
    required: $validation.rule.required,
    sameAs: $validation.rule.sameAs(
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
    $alert.show(msg, 'CONFIRM')
    isUpdating.value = false

    await useSleep(500)
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
