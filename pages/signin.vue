<template>
  <ClientOnly>
    <div v-if="!isLoggedIn && !fetching">
      <WelcomeBackLoginForm v-if="lastLoggedInUser.email" class="mt-10 px-2" />

      <VerticalAccordion v-else class="mt-10 px-2" :tabs="tabs">
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

      <ForgottenPasswordForm
        v-if="showForgottenPassword"
        @close="closeModal()" />

      <UpdatePasswordByHashForm
        v-if="showUpdatePasswordByHash"
        @close="closeModal()" />
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
const { isLoggedIn, fetching } = await useUser({ autoFetch: false })
const { lastLoggedInUser } = await useLastLoggedInUser()

const router = useRouter()
const route = useRoute()

const tabs = computed(() => [
  $i18n.t('login_page.login.title'),
  $i18n.t('login_page.sign_up.title'),
  ...(props.showGuestLogin ? [$i18n.t('login_page.guest_login.title')] : []),
])

const showForgottenPassword = computed(() => {
  return !!route.query['forgotten-password'] && !route.query.hash
})

const showUpdatePasswordByHash = computed(() => !!route.query.hash)

const closeModal = async () => {
  await router.push(toLocalePath({ name: routeList.signin.name }))
}
</script>
