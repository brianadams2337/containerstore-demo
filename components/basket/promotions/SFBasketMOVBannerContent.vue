<template>
  <div
    class="flex flex-col flex-wrap items-center justify-between gap-2 sm:flex-row sm:flex-nowrap md:items-center lg:flex-nowrap"
  >
    <SFPromotionHeadline
      v-if="headlineParts"
      :headline-parts="headlineParts"
      size="sm"
      :style="textColor"
      class="flex-col !items-start self-start text-balance"
    />
    <SFPromotionCountdown
      :time-until="scheduledTo"
      :style="backgroundColorStyle"
      borderless
      class="min-w-30.5 justify-center self-start rounded-xl text-white sm:self-center"
    />
  </div>
  <SFProductPromotionProgressLabel
    :promotion="promotion"
    :formatted-amount-left="formattedAmountLeft"
    :formatted-discount="formattedDiscount"
    :is-full-progress="isFullProgress"
    :is-m-o-v-promotion-applied="isMOVPromotionApplied"
    :min-order-amount="minOrderAmount"
    :progress="progress"
  />
</template>

<script setup lang="ts">
import { toRef, computed } from 'vue'
import type { RFC33339Date } from '@scayle/storefront-nuxt'
import { usePromotionProgress } from '~/composables'
import SFPromotionHeadline from '~/components/promotion/headlines/SFPromotionHeadline.vue'
import SFProductPromotionProgressLabel from '~/components/product/promotion/banners/SFProductPromotionProgressLabel.vue'
import SFPromotionCountdown from '~/components/promotion/SFPromotionCountdown.vue'
import type { Promotion } from '~/types/promotion'
import { getBackgroundColorStyle, getTextColorStyle } from '~/utils'

const {
  promotion,
  headlineParts = [],
  scheduledTo,
  color,
} = defineProps<{
  promotion: Promotion
  headlineParts?: string[]
  scheduledTo: RFC33339Date
  color?: string
}>()

const textColor = computed(() => getTextColorStyle(color))
const backgroundColorStyle = computed(() => getBackgroundColorStyle(color))

const {
  progress,
  minOrderAmount,
  isMOVPromotionApplied,
  formattedDiscount,
  isFullProgress,
  formattedAmountLeft,
} = usePromotionProgress(toRef(() => promotion))
</script>
