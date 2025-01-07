<template>
  <SFPromotionCard
    v-if="promotion"
    :promotion="promotion"
    :background-color="backgroundColorStyle.backgroundColor"
    class="flex w-full flex-col rounded-md px-4 py-2 text-white"
  >
    <template #default="{ headlineParts, scheduledTo }">
      <div
        class="flex flex-wrap justify-between sm:flex-nowrap md:items-center lg:flex-nowrap"
      >
        <SFPromotionHeadline
          v-if="headlineParts"
          :headline-parts="headlineParts"
          size="sm"
          class="text-balance lg:basis-1/2 xl:basis-7/12"
        />
        <SFPromotionCountdown
          :time-until="scheduledTo"
          class="md:items-center md:justify-end lg:basis-1/2 xl:basis-5/12"
          borderless
        />
      </div>
      <SFProductPromotionProgressLabel
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
  </SFPromotionCard>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import type { BasketItem } from '@scayle/storefront-nuxt'
import { useBasketItemPromotion, usePromotionProgress } from '~/composables'
import SFPromotionCard from '~/components/promotion/SFPromotionCard.vue'
import SFPromotionHeadline from '~/components/promotion/headlines/SFPromotionHeadline.vue'
import SFProductPromotionProgressLabel from '~/components/product/promotion/banners/SFProductPromotionProgressLabel.vue'
import SFPromotionCountdown from '~/components/promotion/SFPromotionCountdown.vue'

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
