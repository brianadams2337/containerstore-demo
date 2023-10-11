<template>
  <div
    class="absolute left-auto right-0 top-0 z-20 flex h-8 w-auto cursor-pointer p-1 md:p-3">
    <client-only>
      <WishlistToggle :product="product"/>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { Product } from '@scayle/storefront-nuxt'

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
  wishlistRemoveIcon: {
    type: String as PropType<'heart' | 'close'>,
    default: 'heart',
  },
  listingMetaData: {
    type: Object as PropType<ListItem>,
    default: () => ({}),
  },
})

const product = toRef(props, 'product')
</script>
