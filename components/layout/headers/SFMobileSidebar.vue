<template>
  <aside class="flex flex-col overscroll-contain" data-testid="mobile-sidebar">
    <SFSearchInput
      id="search-mobile"
      data-testid="search-mobile"
      class="mt-1"
      @click-result="$emit('close')"
      @close="$emit('close')"
    />
    <div class="flex grow flex-col p-5 pl-4">
      <SFMobileNavigation
        :is-open="isOpen"
        :navigation-items="navigationItems"
        @click-link="$emit('close')"
      />
      <div class="mt-auto">
        <div class="p-2">
          <SFLocalizedLink
            :to="routeList.location"
            class="text-gray-600"
            data-testid="store-location-link-mobile"
            @click="$emit('close')"
          >
            <IconLocation class="size-5" />
            <div class="mt-1 text-lg font-normal leading-5 lg:text-sm">
              {{ $t('store_locator.button') }}
            </div>
          </SFLocalizedLink>
        </div>
        <SFShopSwitcher listbox-button-aria-id="mobile-shop-switcher" />
        <SFButton
          v-if="user"
          variant="raw"
          data-testid="logout-button"
          class="ml-px p-2 px-2.5 text-lg font-normal leading-5 !text-gray-600 lg:text-sm"
          @click="handleLogout"
        >
          <IconLogout class="mr-1 size-4" />
          {{ $t('global.sign_out') }}
        </SFButton>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { NavigationItems } from '@scayle/storefront-nuxt'
import SFShopSwitcher from './SFShopSwitcher.vue'
import SFMobileNavigation from './SFMobileNavigation.vue'
import SFSearchInput from './search/SFSearchInput.vue'
import { SFButton } from '#storefront-ui/components'
import { routeList } from '~/utils'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'
import { useAuthentication } from '~/composables'
import { useUser } from '#storefront/composables'
import { onBeforeRouteLeave } from '#app/composables/router'

const { isOpen, navigationItems } = defineProps<{
  isOpen: boolean
  navigationItems?: NavigationItems
}>()

const emit = defineEmits<{ close: [] }>()

const { user } = useUser()
const { logout } = useAuthentication('logout')

const handleLogout = async () => {
  await logout()
  emit('close')
}

// Whenever the route changes, we want to make sure that the mobile sidebar is closed.
onBeforeRouteLeave((_to, _from, next) => {
  emit('close')
  next()
})
</script>
