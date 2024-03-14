<template>
  <PromotionGiftConditionBanner
    v-if="promotion"
    v-bind="{ backgroundColor, label }"
    :schedule-to="promotion.schedule.to"
  />
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

const props = defineProps<{ product: Product }>()

const {
  buyXGetYPromotion: promotion,
  quantityLeftForGiftConditions: quantityLeft,
  minOrderValueLeft,
} = await useProductPromotions(props.product)

const backgroundColor = computed(() => {
  const colorHex = promotion.value?.customData.colorHex
  return getBackgroundColorStyle(colorHex).backgroundColor
})

const { label } = usePromotionConditionBanner(minOrderValueLeft, quantityLeft)
</script>
