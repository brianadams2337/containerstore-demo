<template>
  <Popover
    :is-open="isUserFlyoutOpen"
    content-wrapper-class="mt-8"
    @mouseenter="isGreaterThanMd && openUserFlyout()"
    @mouseleave="isGreaterThanMd && closeUserFlyout()">
    <template #action>
      <DefaultLink :to="link" raw>
        <IconUser class="h-5 w-5 cursor-pointer" />
      </DefaultLink>
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
const { user } = await useUser()

const isGreaterThanMd = computed(() => viewport.isGreaterOrEquals('md'))

const link = computed(() => {
  return user.value
    ? { name: routeList.account.name }
    : { name: routeList.signin.name }
})
</script>
