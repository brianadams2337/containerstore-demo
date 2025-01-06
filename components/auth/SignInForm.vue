<template>
  <ClientOnly>
    <div v-if="!isLoggedIn && status !== 'pending'">
      <SFHeadline
        class="mx-auto mt-10 max-w-[33.75rem] px-2"
        size="xl"
        tag="h1"
      >
        {{ $t('login_page.login.title') }}
      </SFHeadline>
      <WelcomeBackLoginForm
        v-if="lastLoggedInUser.email && !$route.query.register"
        class="mt-10 px-2"
      />
      <SFVerticalAccordion
        v-else
        class="mt-10 px-2"
        :initial-index="initialIndex"
        :tabs="tabs"
        tab-tag="h2"
      >
        <template #0>
          <LoginForm />
        </template>

        <template #1>
          <RegisterForm />
        </template>

        <template v-if="showGuestLogin" #2="{ activateTab }">
          <GuestLoginForm />
          <SFButton variant="tertiary" class="w-full" @click="activateTab(0)">
            {{ $t('login_page.guest_login.cancel') }}
          </SFButton>
        </template>
      </SFVerticalAccordion>

      <ForgotPasswordForm
        v-if="isForgotPasswordShown"
        @close:modal="goToSignInPage"
      />

      <UpdatePasswordByHashForm
        v-if="isUpdatePasswordByHashShown"
        @close:modal="goToSignInPage"
      />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ForgotPasswordForm from './ForgotPasswordForm.vue'
import UpdatePasswordByHashForm from './UpdatePasswordByHashForm.vue'
import WelcomeBackLoginForm from './WelcomeBackLoginForm.vue'
import RegisterForm from './RegisterForm.vue'
import LoginForm from './LoginForm.vue'
import GuestLoginForm from './GuestLoginForm.vue'
import { routeList } from '~/utils/route'
import { useLastLoggedInUser, useRouteHelpers } from '~/composables'
import { useRoute } from '#app/composables/router'
import { useNuxtApp } from '#app'
import {
  SFButton,
  SFHeadline,
  SFVerticalAccordion,
} from '#storefront-ui/components'
import { ClientOnly } from '#components'

const props = withDefaults(defineProps<{ showGuestLogin?: boolean }>(), {
  showGuestLogin: true,
})

const { $i18n } = useNuxtApp()
const { lastLoggedInUser, isLoggedIn, status } = await useLastLoggedInUser()

const route = useRoute()

const tabs = computed(() => [
  $i18n.t('login_page.login.title'),
  $i18n.t('login_page.sign_up.title'),
  ...(props.showGuestLogin ? [$i18n.t('login_page.guest_login.title')] : []),
])

const isForgotPasswordShown = computed(() => {
  return !!route.query['forgot-password'] && !route.query.hash
})

const initialIndex = computed(() => (route.query.register ? 1 : 0))

const isUpdatePasswordByHashShown = computed(() => !!route.query.hash)

const { localizedNavigateTo } = useRouteHelpers()
const goToSignInPage = () => localizedNavigateTo(routeList.signin)
</script>
