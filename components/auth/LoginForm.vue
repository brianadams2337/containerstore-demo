<template>
  <form v-if="v">
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

    <ValidatedInputGroup v-slot="{ isValid }" :errors="v.password.$errors">
      <TextInput
        v-model="editableUser.password"
        autocomplete="current-password"
        :placeholder="$t('form_fields.password')"
        type="password"
        :has-errors="!isValid"
        required
        :readonly="isSubmitting"
        @change="v.email.$touch()" />
    </ValidatedInputGroup>

    <div class="py-2 text-right">
      <DefaultLink
        :to="{
          name: routeList.signin.name,
          query: { ['forgotten-password']: 'true' },
        }"
        raw
        class="group relative text-sm text-gray-800 hover:text-black">
        <span>{{ $t('login_page.forget_password.title') }}</span>
        <span
          class="absolute inset-x-[0px] bottom-[-2px] h-[1px] bg-gray-800 transition-all group-hover:inset-x-[-5px] group-hover:bg-black" />
      </DefaultLink>
    </div>

    <AppButton
      class="w-full"
      :disabled="isSubmitting"
      :loading="isSubmitting"
      @click="onSubmit()">
      {{ $t('global.sign_in') }}
    </AppButton>
  </form>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'

const { login, isSubmitting } = await useAuthentication('login')
const { lastLoggedInUser } = await useLastLoggedInUser()

const { $validation } = useNuxtApp()

const editableUser = reactive({
  email: '',
  password: '',
})

const v = useVuelidate(
  {
    email: {
      required: $validation.rule.required,
      email: $validation.rule.email,
    },
    password: {
      required: $validation.rule.required,
    },
  },
  editableUser,
)

const onSubmit = async () => {
  // validate all inputs
  const isValid = await v.value.$validate()
  if (!isValid) {
    return
  }

  await login(editableUser)
}

watch(lastLoggedInUser, (user) => {
  editableUser.email = user.email
})
</script>
