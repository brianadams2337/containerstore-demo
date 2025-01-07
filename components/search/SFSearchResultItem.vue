<template>
  <SFLocalizedLink
    :to="to"
    raw
    class="block cursor-pointer space-y-2 rounded-lg border border-gray-600 p-4 hover:border-gray-900 hover:bg-gray-100 focus:border-gray-900 focus:bg-gray-100"
    data-testid="search-exact-product-item"
  >
    <slot />
  </SFLocalizedLink>
</template>

<script setup lang="ts">
import SFLocalizedLink from '../SFLocalizedLink.vue'
import type { RouteLocationRaw } from '#vue-router'

type Props = {
  to: RouteLocationRaw
}

defineProps<Props>()
</script>
