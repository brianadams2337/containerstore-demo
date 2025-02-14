<template>
  <SFPopover
    :is-open="isOpen && !blockPopup"
    @mouseenter="isOpen = !blockPopup"
    @mouseleave="isOpen = false"
  >
    <template #action>
      <SFLocalizedLink
        :to="link"
        raw
        class="flex size-11 items-center justify-center rounded-md p-2 hover:bg-gray-100"
        data-testid="header-user-button"
        :class="{ 'bg-gray-100': isOpen }"
        :aria-label="$t('my_account.navigation')"
      >
        <IconUser class="size-6" aria-hidden="true" />
      </SFLocalizedLink>
    </template>
    <template #content>
      <SFAsyncDataWrapper :status="status">
        <SFUserActions v-if="user" @close="isOpen = false" />
        <SFLoginActions v-else @close="isOpen = false" />
      </SFAsyncDataWrapper>
    </template>
  </SFPopover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMounted } from '@vueuse/core'
import { useUser } from '#storefront/composables'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'
import { SFPopover } from '~/modules/ui/runtime/components'
import { routeList } from '~/utils'
import SFAsyncDataWrapper from '~/components/SFAsyncDataWrapper.vue'
import SFUserActions from '~/components/account/popover/SFUserActions.vue'
import SFLoginActions from '~/components/account/popover/SFLoginActions.vue'
import { useRoute } from '#app/composables/router'
import { useRouteHelpers } from '~/composables'

defineProps<{ blockPopup?: boolean }>()

const route = useRoute()
const { getLocalizedRoute } = useRouteHelpers()

const { user, status } = useUser()

const mounted = useMounted()

const link = computed(() => {
  if (user.value && mounted.value) {
    return routeList.account
  }
  const localizedSignInPath = getLocalizedRoute(routeList.signin) as string

  if (route.path !== localizedSignInPath) {
    return routeList.signin
  }

  if (route.path === localizedSignInPath) {
    return route.fullPath
  }
  return {}
})

const isOpen = ref(false)
</script>
