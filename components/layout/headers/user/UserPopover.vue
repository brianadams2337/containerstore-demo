<template>
  <Popover
    :is-open="isUserFlyoutOpen"
    content-wrapper-class="mt-8"
    @mouseenter="isGreaterOrEqual('md') && openUserFlyout()"
    @mouseleave="isGreaterOrEqual('md') && closeUserFlyout()"
  >
    <template #action>
      <DefaultLink :to="link" raw>
        <IconAccount class="h-6 w-6" />
      </DefaultLink>
      <div
        v-if="isUserFlyoutOpen"
        class="absolute -bottom-3 h-0.5 w-8 bg-black"
      />
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
const { isGreaterOrEqual } = useDefaultBreakpoints()

const { openUserFlyout, closeUserFlyout, isUserFlyoutOpen } = useFlyouts()
const { user, fetch } = await useUser({ autoFetch: false })

onMounted(() => {
  fetch()
})

const link = computed(() => (user.value ? routeList.account : routeList.signin))
</script>
