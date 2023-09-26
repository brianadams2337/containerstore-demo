<template>
  <Popover
    :is-open="isUserFlyoutOpen"
    content-wrapper-class="mt-8"
    @mouseenter="md && openUserFlyout()"
    @mouseleave="md && closeUserFlyout()">
    <template #action>
      <DefaultLink :to="link" raw>
        <IconAccount class="h-6 w-6" />
      </DefaultLink>
      <div
        v-if="isUserFlyoutOpen"
        class="absolute -bottom-3 h-0.5 w-8 bg-black" />
    </template>
    <template #content>
      <ClientOnly>
        <UserActions v-if="user" />
        <GuestActions v-else />
      </ClientOnly>
    </template>
  </Popover>
</template>

<script setup lang="ts">
const { md } = useViewportBreakpoints()

const { openUserFlyout, closeUserFlyout, isUserFlyoutOpen } = useUiState()
const { user } = await useUser()

const link = computed(() => {
  return user.value
    ? { name: routeList.account.name }
    : { name: routeList.signin.name }
})
</script>
