<template>
  <div
    v-if="!isGiftAlreadyAdded && areGiftConditionsMet"
    class="rounded-md border"
  >
    <div
      class="flex justify-between rounded-t-md px-4 py-2 text-white"
      :style="giftBackgroundColorStyle"
    >
      <SFHeadline size="xs" is-bold>
        {{ $t('basket.promotion.choose_free_gift') }}
      </SFHeadline>
      <PromotionCountdown
        v-if="giftPromotion"
        :until="giftPromotion.schedule.to"
        borderless
      />
    </div>
    <div class="p-4">
      <BasketPromotionGiftsSlider v-bind="{ basketItem, products }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BasketItem } from '@scayle/storefront-nuxt'

const props = defineProps<{ basketItem: BasketItem }>()

const basketItem = computed(() => props.basketItem)

const { giftPromotion, giftBackgroundColorStyle, areGiftConditionsMet } =
  await useBasketItemPromotion(basketItem)

const { products, isGiftAlreadyAdded } = await usePromotionGifts(
  props.basketItem.product,
)
</script>
