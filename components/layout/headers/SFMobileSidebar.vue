<template>
  <aside class="flex flex-col overscroll-contain">
    <SFSearchInput
      id="search-mobile"
      class="mt-1"
      @click:result="$emit('close')"
      @close="$emit('close')"
    />
    <div class="flex grow flex-col p-5">
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
            <div class="mt-1 text-[15px] font-normal lg:text-sm">
              {{ $t('store_locator.button') }}
            </div>
          </SFLocalizedLink>
        </div>
        <SFShopSwitcher listbox-button-aria-id="mobile-shop-switcher" />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { NavigationItems } from '@scayle/storefront-core'
import SFShopSwitcher from './SFShopSwitcher.vue'
import SFMobileNavigation from './SFMobileNavigation.vue'
import SFSearchInput from './search/SFSearchInput.vue'
import { routeList } from '~/utils'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'

const { isOpen, navigationItems } = defineProps<{
  isOpen: boolean
  navigationItems?: NavigationItems
}>()

defineEmits(['close'])
</script>
