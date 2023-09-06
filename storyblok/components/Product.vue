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
      :show-add-to-cart="false"
      :loading="fetching"
      :product="product"
      class="col-span-full"
      @intersect:product="emit('intersect:product', product)">
    </ProductCard>
  </div>
</template>

<script setup lang="ts">
import { Product as BapiProduct } from '@scayle/storefront-nuxt'
const { listingColumns } = useListingUiState()

const props = defineProps({
  width: {
    type: String,
    default: undefined,
  },
  fetching: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  product: {
    type: Object as PropType<BapiProduct>,
    default: () => ({}),
  },
})

const emit = defineEmits(['intersect:product'])
</script>

<script lang="ts">
export default {
  name: 'CmsProduct',
}
</script>
