<template>
  <div
    class="absolute left-auto right-0 top-0 z-20 flex h-8 w-auto cursor-pointer p-1 md:p-3"
  >
    <ClientOnly>
      <WishlistToggle v-bind="{ product, listingMetaData }" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

type Props = {
  product: Product
  wishlistRemoveIcon?: 'heart' | 'close'
  listingMetaData?: ListItem
}

const props = withDefaults(defineProps<Props>(), {
  wishlistRemoveIcon: 'heart',
  listingMetaData: undefined,
})

const product = toRef(props, 'product')
</script>
