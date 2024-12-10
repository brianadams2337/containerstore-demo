<template>
  <div class="flex flex-col overscroll-contain">
    <SearchInput
      class="mt-1"
      @click:result="$emit('close')"
      @close="$emit('close')"
    />
    <div class="flex grow flex-col p-5">
      <MobileNavigation
        :is-open="isOpen"
        :navigation-items="navigationItems"
        @click-link="$emit('close')"
      />
      <div class="mt-auto">
        <div class="p-2">
          <LocalizedLink
            :to="routeList.location"
            class="text-gray-600"
            data-testid="store-location-link-mobile"
            @click="$emit('close')"
          >
            <IconLocation class="size-5" />
            <div class="mt-1 text-[15px] font-normal lg:text-sm">
              {{ $t('store_locator.button') }}
            </div>
          </LocalizedLink>
        </div>
        <ShopSwitcher />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { NavigationItems } from '@scayle/storefront-core'
import ShopSwitcher from './ShopSwitcher.vue'
import MobileNavigation from './MobileNavigation.vue'
import SearchInput from './search/SearchInput.vue'
import { routeList } from '~/utils'
import LocalizedLink from '~/components/LocalizedLink.vue'

const { isOpen, navigationItems } = defineProps<{
  isOpen: boolean
  navigationItems: NavigationItems | undefined
}>()
defineEmits(['close'])
</script>
