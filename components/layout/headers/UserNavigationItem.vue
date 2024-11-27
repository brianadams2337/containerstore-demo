<template>
  <SFPopover
    :is-open="isOpen && !blockPopup"
    @mouseenter="isOpen = !blockPopup"
    @mouseleave="isOpen = false"
  >
    <template #action>
      <LocalizedLink
        :to="link"
        raw
        class="flex size-10 items-center justify-center rounded-md p-2 hover:bg-gray-100"
        data-testid="header-user-button"
        :class="{ 'bg-gray-100': isOpen }"
        :aria-label="$t('my_account.navigation')"
      >
        <IconNewUser class="size-6" aria-hidden="true" />
      </LocalizedLink>
    </template>
    <template #content>
      <AsyncDataWrapper :status="status">
        <UserActions v-if="user" @close="isOpen = false" />
        <LoginActions v-else @close="isOpen = false" />
      </AsyncDataWrapper>
    </template>
  </SFPopover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMounted } from '@vueuse/core'
import { useUser } from '#storefront/composables'
import LocalizedLink from '~/components/LocalizedLink.vue'
import { SFPopover } from '~/modules/ui/runtime/components'
import { routeList } from '~/utils'
import AsyncDataWrapper from '~/components/AsyncDataWrapper.vue'
import UserActions from '~/components/account/popover/UserActions.vue'
import LoginActions from '~/components/account/popover/LoginActions.vue'

const { user, status } = useUser()
const mounted = useMounted()
const link = computed(() =>
  user.value && mounted.value ? routeList.account : routeList.signin,
)

const isOpen = ref(false)

defineProps<{ blockPopup?: boolean }>()
</script>
