<template>
  <SFPopover
    :is-open="isUserFlyoutOpen"
    content-wrapper-class="mt-8"
    @mouseenter="isGreaterOrEqual('md') && openUserFlyout()"
    @mouseleave="isGreaterOrEqual('md') && closeUserFlyout()"
  >
    <template #action>
      <SFLink :to="link" raw>
        <IconAccount class="size-6" />
      </SFLink>
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
  </SFPopover>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { routeList } from '~/utils/route'
import { useUser } from '#storefront/composables'
import { useDefaultBreakpoints, useFlyouts } from '~/composables'

const { isGreaterOrEqual } = useDefaultBreakpoints()

const { openUserFlyout, closeUserFlyout, isUserFlyoutOpen } = useFlyouts()
const { user, fetch } = await useUser({ autoFetch: false })

onMounted(() => {
  fetch()
})

const link = computed(() => (user.value ? routeList.account : routeList.signin))
</script>
