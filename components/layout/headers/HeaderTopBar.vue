<template>
  <div class="hidden h-9 w-full bg-accent font-medium md:flex">
    <div class="container flex">
      <div class="ml-auto flex gap-5 text-sm">
        <LocalizedLink
          data-testid="store-location-link"
          :to="routeList.location"
          raw
          class="flex shrink-0 items-center gap-1.5 whitespace-nowrap px-2 text-white -outline-offset-4 hover:bg-indigo-200/10"
        >
          <IconLocationMenu class="size-3.5" />
          {{ $t('navigation.location') }}
        </LocalizedLink>
        <ShopSwitcher />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShopSwitcher from './ShopSwitcher.vue'
import LocalizedLink from '~/components/LocalizedLink.vue'
import { routeList } from '~/utils/route'
</script>
