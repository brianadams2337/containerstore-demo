<template>
  <SFHorizontalItemsSlider class="w-full snap-x snap-mandatory scrollbar-hide">
    <SFLink
      v-for="{ id, image } in siblings"
      :key="id"
      :to="getProductDetailRoute(product, id)"
      class="mr-2 flex size-12 shrink-0 items-center justify-center rounded-md bg-gray-200"
    >
      <ProductImage
        v-if="image"
        :image="image"
        sizes="xs:20vw sm:20vw md:20vw"
        class="size-full"
      />
    </SFLink>
  </SFHorizontalItemsSlider>
</template>

<script setup lang="ts">
import type { ProductSibling, Product } from '@scayle/storefront-nuxt'
import { useRouteHelpers } from '~/composables'

defineProps<{
  product: Product
  siblings: ProductSibling[]
}>()

const { getProductDetailRoute } = useRouteHelpers()
</script>
