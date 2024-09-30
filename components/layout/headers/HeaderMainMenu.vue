<template>
  <div class="flex items-center justify-end text-primary">
    <HeaderSearch class="hidden md:flex" />
    <div class="ml-1 flex h-full items-center justify-center space-x-4">
      <div class="inline-flex h-full items-center justify-center">
        <SFLink
          data-testid="store-location-link"
          :to="routeList.location"
          type="loud"
        >
          <IconLocationMenu class="size-6 cursor-pointer" />
        </SFLink>
      </div>
      <UserPopover data-testid="user-popover" />
      <WishlistLink />
      <BasketPopover />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderSearch from './search/HeaderSearch.vue'
import UserPopover from './user/UserPopover.vue'
import WishlistLink from './WishlistLink.vue'
import BasketPopover from '~/components/basket/popover/BasketPopover.vue'
import { SFLink } from '#storefront-ui/components'
import { routeList } from '~/utils/route'
</script>
