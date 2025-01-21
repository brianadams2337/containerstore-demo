<template>
  <SFPromotionCard
    :background-color="
      getBackgroundColorStyle(color, AlphaColorMap.ALPHA_20).backgroundColor
    "
    :style="getTextColorStyle(color)"
    :promotion="promotion"
    class="relative flex flex-col items-start rounded-xl bg-blue px-4 py-3 text-white"
  >
    <template #default="{ headlineParts, scheduledTo }">
      <div class="flex w-full items-center justify-between">
        <SFPromotionHeadline
          v-if="headlineParts"
          :headline-parts="headlineParts"
          :style="textColor"
          size="sm"
          is-column
          class="mb-2"
        />
        <SFPromotionCountdown
          :time-until="scheduledTo"
          :style="backgroundColorStyle"
          borderless
          class="min-w-30.5 justify-center rounded-xl text-white"
        />
      </div>
      <div
        v-if="isPriorityBadgeShown"
        class="rounded-md border px-2 py-1 text-2xs font-semibold uppercase"
      >
        {{ $t('promotion.highest_priority') }}
      </div>
      <ClientOnly>
        <template #fallback>
          <div v-if="minOrderAmount" class="mt-3.5 flex w-full flex-col">
            <SFSkeletonLoader
              v-for="n in 3"
              :key="n"
              type="custom"
              class="my-1 h-2 w-full rounded-sm"
            />
          </div>
        </template>
        <SFFadeInTransition>
          <SFProductPromotionProgressLabel
            :promotion="promotion"
            :is-gift-added-to-basket="isGiftAddedToBasket"
            :are-gift-conditions-met="areGiftConditionsMet"
            :formatted-amount-left="formattedAmountLeft"
            :formatted-discount="formattedDiscount"
            :is-full-progress="isFullProgress"
            :is-m-o-v-promotion-applied="isMOVPromotionApplied"
            :min-order-amount="minOrderAmount"
            :progress="progress"
          />
        </SFFadeInTransition>
      </ClientOnly>
    </template>
  </SFPromotionCard>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import SFProductPromotionProgressLabel from './SFProductPromotionProgressLabel.vue'
import { getBackgroundColorStyle, getTextColorStyle } from '~/utils/promotion'
import { usePromotionProgress } from '~/composables'
import { ClientOnly } from '#components'
import { SFSkeletonLoader, SFFadeInTransition } from '#storefront-ui/components'
import SFPromotionCountdown from '~/components/promotion/SFPromotionCountdown.vue'
import SFPromotionCard from '~/components/promotion/SFPromotionCard.vue'
import SFPromotionHeadline from '~/components/promotion/headlines/SFPromotionHeadline.vue'
import type { Promotion } from '~/types/promotion'
import { AlphaColorMap } from '~/constants'

type Props = {
  promotion: Promotion
  isPriorityBadgeShown?: boolean
  isGiftAddedToBasket?: boolean
  areGiftConditionsMet?: boolean
}

const {
  promotion,
  isPriorityBadgeShown = false,
  isGiftAddedToBasket = false,
  areGiftConditionsMet = false,
} = defineProps<Props>()

const {
  progress,
  minOrderAmount,
  isMOVPromotionApplied,
  formattedDiscount,
  isFullProgress,
  formattedAmountLeft,
} = usePromotionProgress(toRef(() => promotion))

const color = computed(() => promotion.customData.colorHex)

const textColor = computed(() => getTextColorStyle(color.value))
const backgroundColorStyle = computed(() =>
  getBackgroundColorStyle(color.value),
)
</script>
