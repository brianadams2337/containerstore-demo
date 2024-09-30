<template>
  <div class="grid grid-cols-8">
    <ProductCard
      :key="`product-disruptor-${product.id}`"
      :class="{
        'col-span-full': width === '1' || width === undefined,
        'col-span-full md:col-span-4 md:col-start-3':
          (width === '2' && listingColumns === 3) || listingColumns === 1,
        'col-span-full md:col-span-8': width === '2' && listingColumns === 2,
      }"
      :product="product"
      :multiple-images="multipleImages"
      class="col-span-full"
      @intersect:product="emit('intersect:product', product)"
    />
  </div>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import { useListingUiState } from '~/composables/useListingUiState'
// TODO: This needs to be decoupled from the CMS module as it is coming from the SFB local components
import ProductCard from '~/components/product/card/ProductCard.vue'

type CMSProductProps = {
  width?: string
  multipleImages?: boolean
  product: Product
}

defineProps<CMSProductProps>()

const { listingColumns } = useListingUiState()

const emit = defineEmits(['intersect:product'])

defineOptions({ name: 'CMSProduct' })
</script>
