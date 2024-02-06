<template>
  <ClientOnly>
    <div v-if="!isLoggedIn && !isFetching">
      <WelcomeBackLoginForm v-if="lastLoggedInUser.email" class="mt-10 px-2" />

      <VerticalAccordion
        v-else
        class="mt-10 px-2"
        :initial-index="initialIndex"
        :tabs="tabs"
      >
        <template #0>
          <LoginForm />
        </template>

        <template #1>
          <RegisterForm />
        </template>

        <template v-if="showGuestLogin" #2="{ activateTab }">
          <GuestLoginForm />
          <AppButton type="tertiary" class="w-full" @click="activateTab(0)">
            {{ $t('login_page.guest_login.cancel') }}
          </AppButton>
        </template>
      </VerticalAccordion>

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
const props = defineProps({
  showGuestLogin: {
    type: Boolean,
    default: true,
  },
})

const { $i18n } = useNuxtApp()
const { lastLoggedInUser, isLoggedIn, isFetching } = await useLastLoggedInUser()

const route = useRoute()

const tabs = computed(() => [
  $i18n.t('login_page.login.title'),
  $i18n.t('login_page.sign_up.title'),
  ...(props.showGuestLogin ? [$i18n.t('login_page.guest_login.title')] : []),
])

const isForgotPasswordShown = computed(() => {
  return !!route.query['forgot-password'] && !route.query.hash
})

const initialIndex = computed(() => {
  return route.query.register ? 1 : 0
})

const isUpdatePasswordByHashShown = computed(() => !!route.query.hash)
const { localizedNavigateTo } = useRouteHelpers()
const goToSignInPage = () => localizedNavigateTo(routeList.signin)
</script>
