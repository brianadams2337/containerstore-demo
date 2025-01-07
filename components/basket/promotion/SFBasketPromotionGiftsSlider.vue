<template>
  <SFItemsSlider class="w-full snap-x snap-mandatory" with-arrows>
    <div
      v-for="(product, index) in products"
      :key="product.id"
      class="mr-3 flex max-h-80 w-32 flex-col justify-between p-1 last-of-type:mr-0"
    >
      <SFBasketPromotionSliderItem
        v-if="product"
        :product="product"
        :index="index"
        :basket-item="basketItem"
      />
    </div>
  </SFItemsSlider>
</template>

<script setup lang="ts">
import type { BasketItem, Product } from '@scayle/storefront-nuxt'
import SFBasketPromotionSliderItem from './SFBasketPromotionSliderItem.vue'
import { SFItemsSlider } from '#storefront-ui/components'

type Props = {
  products?: Product[]
  basketItem: BasketItem
}

withDefaults(defineProps<Props>(), {
  products: () => [],
})
</script>
