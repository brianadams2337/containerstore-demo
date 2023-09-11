<template>
  <Popover
    :is-open="isUserFlyoutOpen"
    content-wrapper-class="mt-8"
    @mouseenter="isGreatedThanMd && openUserFlyout()"
    @mouseleave="isGreatedThanMd && closeUserFlyout()">
    <template #action>
      <IconUser class="h-5 w-5 cursor-pointer" @click="redirectToMyAccount" />
      <div
        v-if="isUserFlyoutOpen"
        class="absolute -bottom-3 left-2 h-0.5 w-8 bg-black" />
    </template>
    <template v-if="user" #content>
      <ClientOnly>
        <UserActions />
      </ClientOnly>
    </template>
    <template v-else #content>
      <ClientOnly>
        <GuestActions />
      </ClientOnly>
    </template>
  </Popover>
</template>

<script setup lang="ts">
const viewport = useViewport()

const { openUserFlyout, closeUserFlyout, isUserFlyoutOpen } = useUiState()
const router = useRouter()
const { user } = await useUser()

const isGreatedThanMd = computed(() => viewport.isGreaterOrEquals('md'))

const redirectToMyAccount = async () => {
  if (isGreatedThanMd.value) {
    return
  }
  const route = toLocalePath(
    user.value
      ? { name: routeList.account.name }
      : { name: routeList.signin.name },
  )
  await router.push(route)
}
</script>
