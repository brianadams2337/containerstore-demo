<template>
  <SFLink
    class="inline-block w-fit px-1 py-px text-base tracking-tighter text-gray-600 duration-300 ease-out hover:translate-x-1 hover:rounded-[4px] hover:bg-gray-100 hover:transition-transform"
    :class="{
      'text-status-error hover:bg-status-error/10': isSale,
      'bg-status-error/10': isSale && isActive,
      'translate-x-1 rounded-[4px] bg-gray-100 font-medium text-gray-900 transition-transform':
        isActive,
    }"
    :to="buildCategoryPath(props.category)"
    raw
  >
    {{ category.name }}
    <span
      v-if="isSale"
      class="inline-block -translate-y-1 text-3xs text-status-error"
    >
      %
    </span>
  </SFLink>
</template>

<script setup lang="ts">
import type { Category } from '@scayle/storefront-nuxt'
import { useRouteHelpers } from '~/composables'
import { SFLink } from '#storefront-ui/components'

const props = defineProps<{
  category: Category
  isSale: boolean
  isActive: boolean
}>()

const { buildCategoryPath } = useRouteHelpers()
</script>
