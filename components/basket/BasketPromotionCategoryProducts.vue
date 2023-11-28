<template>
  <FadeInTransition>
    <div v-if="isSliderShown" class="rounded-md border">
      <div
        class="flex items-center justify-between rounded-t-md px-4 py-2 text-white"
        :style="backgroundColorStyle"
      >
        <PromotionHeadline
          v-if="headlineParts"
          :headline-parts="headlineParts"
          is-column
          class="mb-2"
        />

        <PromotionCountdown v-if="promotion" :until="promotion.schedule.to" />
      </div>
      <div class="p-4">
        <BasketPromotionProductsSlider v-bind="{ basketItem, products }" />
      </div>
    </div>
  </FadeInTransition>
</template>

<script setup lang="ts">
import { type BasketItem, getSortByValue } from '@scayle/storefront-nuxt'

const props = defineProps<{ basketItem: BasketItem }>()

const basketItem = computed(() => props.basketItem)

const { isAutomaticDiscount, backgroundColorStyle, promotion, headlineParts } =
  useBasketItemPromotion(basketItem)

const categoryPath = computed(() => `/${promotion.value?.customData.category}`)

const params = computed(() => ({
  category: categoryPath.value,
  perPage: PRODUCTS_PER_PAGE,
  cache: {
    ttl: 1000,
    cacheKeyPrefix: `PE:${categoryPath.value}`,
  },
  sort: getSortByValue('', DEFAULT_SORTING_KEY),
}))

const productsData = await useProducts({ params: params.value })

const products = computed(() => productsData.data?.value?.products)

const isSliderShown = computed(() => {
  return promotion.value && isAutomaticDiscount.value
})
</script>
