<template>
  <component :is="divOrTransition" class="w-full">
    <template v-if="areHurryToSaveBannersShown && isMounted">
      <PromotionHurryToSaveBanners
        v-for="promotion in appliedPromotions"
        :key="promotion.id"
        :promoted-product-id="product.id"
        :promotion-id="productPromotionId"
        :promotion="promotion"
        class="mt-2 w-full md:flex"
      />
    </template>
    <ProductPromotionDefaultBanners
      v-else
      :product="product"
      :applicable-promotions="applicablePromotions"
      :is-highest-priority="isHighestPriority"
      :is-gift-added-to-basket="isGiftAddedToBasket"
      :are-gift-conditions-met="areGiftConditionsMet"
      class="mt-2 md:flex"
    />
  </component>
</template>

<script setup lang="ts">
import { useMounted } from '@vueuse/core'
import { computed } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import { useBasketPromotions } from '~/composables/useBasketPromotions'
import { useProductPromotions } from '~/composables'
import { SFFadeInTransition } from '#components'

const props = defineProps<{ product: Product }>()

const {
  areHurryToSaveBannersShown,
  applicablePromotions,
  isHighestPriority,
  isGiftAddedToBasket,
  areGiftConditionsMet,
  productPromotionId,
} = useProductPromotions(props.product)
const { appliedPromotions } = await useBasketPromotions()

const isMounted = useMounted()
const divOrTransition = computed(() => {
  return !isMounted.value ? 'div' : SFFadeInTransition
})
</script>
