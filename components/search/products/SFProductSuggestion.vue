<template>
  <SFSearchResultItem
    :to="getProductDetailRoute(product.id, name)"
    raw
    class="group flex items-center space-x-4 !p-1 !pr-6"
    data-testid="search-exact-product-item"
    @click="emit('click:result', productSuggestion)"
  >
    <div
      class="flex h-16 w-14 shrink-0 items-center overflow-hidden rounded-md bg-gray-100"
    >
      <NuxtImg v-if="image" provider="scayle" :src="image?.hash" width="60px" />
    </div>
    <div class="grow overflow-hidden text-gray-600">
      <div class="truncate text-base font-semi-bold-variable">
        {{ brand }}
      </div>
      <div class="truncate text-base">
        {{ name }}
      </div>
    </div>
    <SFProductPrice :price="product.priceRange!.min" />
  </SFSearchResultItem>
</template>

<script setup lang="ts">
import type { ProductSearchSuggestion } from '@scayle/storefront-core'
import SFSearchResultItem from '../SFSearchResultItem.vue'
import { useProductBaseInfo, useRouteHelpers } from '~/composables'
import { NuxtImg } from '#components'
import SFProductPrice from '~/components/product/SFProductPrice.vue'

type Props = {
  productSuggestion: ProductSearchSuggestion
}
const { productSuggestion } = defineProps<Props>()
const emit = defineEmits<{
  (e: 'click:result', suggestion: ProductSearchSuggestion): void
}>()

const product = productSuggestion.productSuggestion.product

const { getProductDetailRoute } = useRouteHelpers()
const { name, image, brand } = useProductBaseInfo(product)
</script>
