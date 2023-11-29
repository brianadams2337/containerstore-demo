<template>
  <div v-if="!isGiftAlreadyAdded" class="rounded-md border">
    <div
      class="flex justify-between rounded-t-md px-4 py-2 text-white"
      :style="backgroundColorStyle"
    >
      <Headline size="xs" is-bold>
        {{ $t('basket.promotion.choose_free_gift') }}
      </Headline>
      <PromotionCountdown
        v-if="promotion"
        :until="promotion.schedule.to"
        borderless
      />
    </div>
    <div class="p-4">
      <BasketPromotionProductsSlider
        v-bind="{ basketItem, products }"
        is-free
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BasketItem } from '@scayle/storefront-nuxt'

const props = defineProps<{ basketItem: BasketItem }>()

const { items: basketItems } = await useBasket()

const basketItem = computed(() => props.basketItem)

const { backgroundColorStyle, promotion } = useBasketItemPromotion(basketItem)

const { products, variantIds } = await usePromotionGifts(
  props.basketItem.product,
)

const isGiftAlreadyAdded = computed(() => {
  return basketItems.value.some((item) => {
    return variantIds.value?.includes(item.variant.id)
  })
})
</script>
