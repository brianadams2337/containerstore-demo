<template>
  <SFLink
    class="inline-block w-fit rounded px-1 py-px text-md tracking-tighter text-gray-600 duration-300 ease-out hover:bg-gray-100"
    :class="{
      'text-product-sale hover:bg-product-sale/10': isSale,
      'bg-product-sale/10': isSale && isActive,
      'translate-x-1 rounded bg-gray-100 font-medium text-gray-900 transition-transform':
        isActive,
    }"
    :to="buildCategoryPath(category)"
    raw
  >
    {{ category.name }}
    <span
      v-if="isSale"
      class="inline-block -translate-y-1 text-3xs text-product-sale"
    >
      %
    </span>
  </SFLink>
</template>

<script setup lang="ts">
import type { Category } from '@scayle/storefront-nuxt'
import { useRouteHelpers } from '~/composables'
import { SFLink } from '#storefront-ui/components'

defineProps<{
  category: Category
  isSale: boolean
  isActive: boolean
}>()

const { buildCategoryPath } = useRouteHelpers()
</script>
