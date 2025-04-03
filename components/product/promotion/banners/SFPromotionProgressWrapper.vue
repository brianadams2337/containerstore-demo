<template>
  <div
    v-if="isMovPromotion && (progress || text)"
    class="flex flex-col px-6 pt-4 text-md text-gray-600"
  >
    <SFProgressBar
      v-if="progress !== undefined"
      class="mb-2"
      :progress="progress * 100"
      :color="colorStyle.backgroundColor"
    />
    <div v-if="text" class="mb-4">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Promotion, CentAmount } from '@scayle/storefront-nuxt'
import { computed } from 'vue'
import { useI18n } from '#imports'
import SFProgressBar from '~/components/promotion/SFProgressBar.vue'
import { usePromotionMOVProgress } from '#storefront-promotions/composables'
import { usePromotionCustomData } from '~/composables'
import {
  isAutomaticDiscountType,
  isBuyXGetYType,
} from '#storefront-promotions/utils'
import { useFormatHelpers } from '#storefront/composables'

const { promotion, isGiftAddedToBasket, areGiftConditionsMet } = defineProps<{
  promotion: Promotion
  isGiftAddedToBasket?: boolean
  areGiftConditionsMet?: boolean
}>()

const { t } = useI18n()

const {
  progress,
  isMOVPromotionApplied,
  discount,
  remaining,
  minimumOrderValueReached,
} = usePromotionMOVProgress(
  promotion,
  promotion.customData.minimumOrderValue || (0 as CentAmount),
)

const { colorStyle } = usePromotionCustomData(promotion)

const isAutomaticDiscount = computed(() => isAutomaticDiscountType(promotion))

const isBuyXGetY = computed(() => isBuyXGetYType(promotion))

const isMovPromotion = computed(() => {
  return !!promotion.customData.minimumOrderValue
})

const { formatCurrency } = useFormatHelpers()
const text = computed(() => {
  if (!minimumOrderValueReached.value) {
    return remaining.value
      ? t('promotion.progress_left', {
          amount: formatCurrency(remaining.value),
        })
      : undefined
  }

  if (
    isMOVPromotionApplied.value &&
    ((isBuyXGetY.value && areGiftConditionsMet) || isAutomaticDiscount.value)
  ) {
    return t('pdp.promotion.full_progress_message', {
      amount: formatCurrency(discount.value),
    })
  }

  if (
    isAutomaticDiscount.value ||
    (!isGiftAddedToBasket && areGiftConditionsMet)
  ) {
    return t('pdp.promotion.cart_reached')
  }

  return isGiftAddedToBasket && areGiftConditionsMet
    ? t('pdp.promotion.add_free_gift_when_cart_reached')
    : undefined
})
</script>
