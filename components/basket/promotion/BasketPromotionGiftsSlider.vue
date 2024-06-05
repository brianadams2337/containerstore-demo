<template>
  <SFHorizontalItemsSlider class="w-full snap-x snap-mandatory" with-arrows>
    <div
      v-for="(product, index) in products"
      :key="product.id"
      class="mr-3 flex max-h-80 w-32 flex-col justify-between last-of-type:mr-0"
    >
      <BasketPromotionSliderItem
        v-if="product"
        v-bind="{ product, index, basketItem }"
      />
    </div>
  </SFHorizontalItemsSlider>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { BasketItem, Product } from '@scayle/storefront-nuxt'

type Props = {
  products: Product[]
  basketItem: BasketItem
}

defineProps<Props>()
</script>
