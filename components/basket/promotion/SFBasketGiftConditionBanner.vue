<template>
  <SFPromotionCard
    v-if="promotion"
    :promotion="promotion"
    :background-color="giftBackgroundColorStyle.backgroundColor"
    class="flex flex-col items-start gap-y-0.5 rounded-md px-4 py-2 text-white md:items-center lg:flex-nowrap"
  >
    <template #default="{ headlineParts, scheduledTo }">
      <div class="flex w-full items-center justify-between">
        <SFPromotionHeadline
          v-if="headlineParts"
          :headline-parts="headlineParts"
          size="sm"
          is-column
        />
        <SFPromotionCountdown
          :time-until="scheduledTo"
          borderless
          class="md:basis-1/2 md:items-center md:justify-end lg:basis-7/12 xl:basis-5/12"
        />
      </div>
      <SFProductPromotionProgressLabel
        :promotion="promotion"
        :progress="progress"
        :min-order-amount="minOrderAmount"
        :is-m-o-v-promotion-applied="isMOVPromotionApplied"
        :is-full-progress="isFullProgress"
        :is-gift-added-to-basket="isGiftAddedToBasket"
        :are-gift-conditions-met="areGiftConditionsMet"
        :formatted-amount-left="formattedAmountLeft"
        :formatted-discount="formattedDiscount"
      />
    </template>
  </SFPromotionCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BasketItem } from '@scayle/storefront-nuxt'
import { useBasketItemPromotion, usePromotionProgress } from '~/composables'
import SFPromotionCard from '~/components/promotion/SFPromotionCard.vue'
import SFPromotionHeadline from '~/components/promotion/headlines/SFPromotionHeadline.vue'
import SFProductPromotionProgressLabel from '~/components/product/promotion/banners/SFProductPromotionProgressLabel.vue'
import SFPromotionCountdown from '~/components/promotion/SFPromotionCountdown.vue'

const props = defineProps<{ basketItem: BasketItem }>()

const basketItem = computed(() => props.basketItem)

const {
  giftPromotion: promotion,
  giftBackgroundColorStyle,
  isGiftAddedToBasket,
  areGiftConditionsMet,
} = useBasketItemPromotion(basketItem)

const {
  progress,
  minOrderAmount,
  isMOVPromotionApplied,
  formattedDiscount,
  isFullProgress,
  formattedAmountLeft,
} = usePromotionProgress(promotion)
</script>
