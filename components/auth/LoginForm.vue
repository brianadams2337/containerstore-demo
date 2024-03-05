<template>
  <div class="flex flex-col gap-6">
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
          data-test-id="login-email"
          @change="v.email.$touch()"
        />
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
          data-test-id="login-password"
          @change="v.password.$touch()"
        />
      </ValidatedInputGroup>

      <div class="py-2 text-right">
        <DefaultLink
          :to="{
            name: routeList.signin.name,
            query: { ['forgot-password']: 'true' },
          }"
          raw
          class="group relative text-sm text-gray-800 hover:text-black"
        >
          <span>{{ $t('login_page.forgot_password.title') }}</span>
          <span
            class="absolute inset-x-[0px] bottom-[-2px] h-[1px] bg-gray-800 transition-all group-hover:inset-x-[-5px] group-hover:bg-black"
          />
        </DefaultLink>
      </div>

      <AppButton
        class="w-full"
        :disabled="isSubmitting"
        :loading="isSubmitting"
        data-test-id="login-submit"
        @click="onSubmit()"
      >
        {{ $t('global.sign_in') }}
      </AppButton>
    </form>
    <IDPForm v-if="!!externalIDPRedirects" :redirects="externalIDPRedirects" />
  </div>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'

const { data: externalIDPRedirects } = await useIDP()
const { login, isSubmitting, loginIDP } = await useAuthentication('login')
const { lastLoggedInUser } = await useLastLoggedInUser()

const validationRules = useValidationRules()

const route = useRoute()

const editableUser = reactive({
  email: '',
  password: '',
})

const rules = {
  email: {
    required: validationRules.required,
    email: validationRules.email,
  },
  password: {
    required: validationRules.required,
  },
}

const v = useVuelidate(rules, editableUser)

watch(editableUser, () => {
  v.value.$touch()
})

watch(
  () => route.query.code,
  async (code) => {
    if (isSubmitting.value) {
      return
    }

    if (isString(code)) {
      await loginIDP(code)
    }
  },
  { immediate: true },
)

watch(lastLoggedInUser, (user) => {
  editableUser.email = user.email
})

const onSubmit = async () => {
  const isValid = await v.value.$validate()
  if (!isValid) {
    return
  }

  await login(editableUser)
}
</script>
