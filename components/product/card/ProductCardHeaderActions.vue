<template>
  <div
    class="absolute left-auto right-1 top-1 z-20 flex h-8 w-auto cursor-pointer p-1 md:right-0 md:top-0 md:p-3"
  >
    <ClientOnly>
      <template #fallback>
        <IconHeartInactive
          class="size-6 animate-pulse fill-gray-200 text-gray-200"
        />
      </template>
      <WishlistToggle v-bind="{ product, listingMetaData }" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'

type Props = {
  product: Product
  listingMetaData?: ListItem
}

const props = withDefaults(defineProps<Props>(), { listingMetaData: undefined })

const product = toRef(props, 'product')
</script>
