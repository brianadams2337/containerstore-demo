<template>
  <div class="flex flex-col gap-6">
    <form v-if="v">
      <SFValidatedInputGroup v-slot="{ isValid }" :errors="v.email.$errors">
        <SFTextInput
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
      </SFValidatedInputGroup>

      <SFValidatedInputGroup v-slot="{ isValid }" :errors="v.password.$errors">
        <SFTextInput
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
      </SFValidatedInputGroup>

      <div class="py-2 text-right">
        <SFLink
          :to="{
            name: routeList.signin.name,
            query: { ['forgot-password']: 'true' },
          }"
          raw
          class="group relative text-sm text-gray-600 hover:text-black"
        >
          <span>{{ $t('login_page.forgot_password.title') }}</span>
          <span
            class="absolute inset-x-0 -bottom-0.5 h-px bg-gray-600 transition-all group-hover:-inset-x-1 group-hover:bg-black"
          />
        </SFLink>
      </div>

      <SFButton
        class="w-full"
        :disabled="isSubmitting"
        :loading="isSubmitting"
        data-test-id="login-submit"
        @click="onSubmit()"
      >
        {{ $t('global.sign_in') }}
      </SFButton>
    </form>
    <IDPForm v-if="hasIDPs" :redirects="externalIDPRedirects" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import useVuelidate from '@vuelidate/core'
import { isString } from 'radash'
import {
  useAuthentication,
  useLastLoggedInUser,
  useValidationRules,
} from '~/composables'
import { useIDP } from '#storefront/composables'
import { useRoute } from '#app/composables/router'
import { routeList } from '~/utils/route'

const route = useRoute()

const idpParams = computed(() => {
  if (isString(route.query.redirectUrl)) {
    return {
      queryParams: { redirectUrl: route.query.redirectUrl },
    }
  }

  return { queryParams: undefined }
})

const { data: externalIDPRedirects } = useIDP(idpParams)

const editableUser = reactive({
  email: '',
  password: '',
})
const { login, isSubmitting } = useAuthentication('login')
const { lastLoggedInUser } = await useLastLoggedInUser()

if (lastLoggedInUser.value) {
  editableUser.email = lastLoggedInUser.value.email
}

const hasIDPs = computed(
  () =>
    externalIDPRedirects.value &&
    Object.keys(externalIDPRedirects.value).length > 0,
)

const validationRules = useValidationRules()

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

const onSubmit = async () => {
  const isValid = await v.value.$validate()
  if (!isValid) {
    return
  }

  await login(editableUser)
}
</script>
