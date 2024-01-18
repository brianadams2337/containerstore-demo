<template>
  <div
    v-if="hasQuantityLeft"
    class="flex justify-between rounded-md px-4 py-2 text-white"
    :style="getBackgroundColorStyle(promotion?.customData.colorHex)"
  >
    <Headline size="xs" is-bold>
      {{ $t('basket.promotion.gift_conditional_label', { quantityLeft }) }}
    </Headline>
    <PromotionCountdown
      v-if="promotion"
      :until="promotion.schedule.to"
      borderless
    />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

const props = defineProps<{ product: Product }>()

const {
  buyXGetYPromotion: promotion,
  hasQuantityLeftForGiftConditions: hasQuantityLeft,
  quantityLeftForGiftConditions: quantityLeft,
} = await useProductPromotions(props.product)
</script>
