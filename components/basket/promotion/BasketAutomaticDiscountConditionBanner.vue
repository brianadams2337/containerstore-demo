<template>
  <PromotionCard
    v-if="promotion"
    :promotion="promotion"
    :background-color="backgroundColorStyle.backgroundColor"
    class="flex w-full flex-col rounded-md px-4 py-2 text-white"
  >
    <template #default="{ headlineParts, scheduledTo }">
      <div
        class="flex flex-wrap justify-between sm:flex-nowrap md:items-center lg:flex-nowrap"
      >
        <PromotionHeadline
          v-if="headlineParts"
          :headline-parts="headlineParts"
          size="sm"
          class="text-balance lg:basis-1/2 xl:basis-7/12"
        />
        <PromotionCountdown
          :time-until="scheduledTo"
          class="md:items-center md:justify-end lg:basis-1/2 xl:basis-5/12"
          borderless
        />
      </div>
      <ProductPromotionProgressLabel
        v-if="isMOVPromotionApplied && promotion"
        :promotion="promotion"
        :formatted-amount-left="formattedAmountLeft"
        :formatted-discount="formattedDiscount"
        :is-full-progress="isFullProgress"
        :is-m-o-v-promotion-applied="isMOVPromotionApplied"
        :min-order-amount="minOrderAmount"
        :progress="progress"
        class="mb-1"
      />
    </template>
  </PromotionCard>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import type { BasketItem } from '@scayle/storefront-nuxt'
import { useBasketItemPromotion, usePromotionProgress } from '~/composables'
import PromotionCard from '~/components/promotion/PromotionCard.vue'
import PromotionHeadline from '~/components/promotion/headlines/PromotionHeadline.vue'
import ProductPromotionProgressLabel from '~/components/product/promotion/banners/ProductPromotionProgressLabel.vue'
import PromotionCountdown from '~/components/promotion/PromotionCountdown.vue'

const props = defineProps<{ basketItem: BasketItem }>()

const { promotion, backgroundColorStyle } = useBasketItemPromotion(
  toRef(props.basketItem),
)

const {
  progress,
  minOrderAmount,
  isMOVPromotionApplied,
  formattedDiscount,
  isFullProgress,
  formattedAmountLeft,
} = usePromotionProgress(promotion)
</script>
