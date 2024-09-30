<template>
  <div class="flex w-full flex-col">
    <ProductPromotionDefaultBannersItem
      v-for="promotion in applicablePromotions"
      :key="promotion.id"
      :promotion="promotion"
      :is-gift-added-to-basket="isGiftAddedToBasket"
      :are-gift-conditions-met="areGiftConditionsMet"
      :is-priority-badge-shown="isHighestPriority(promotion.priority)"
      class="mb-2 w-full"
    />
  </div>
</template>

<script setup lang="ts">
import ProductPromotionDefaultBannersItem from './ProductPromotionDefaultBannersItem.vue'

defineProps<{
  applicablePromotions: Promotion[]
  isHighestPriority: (priority: number) => boolean
  isGiftAddedToBasket: boolean
  areGiftConditionsMet: boolean
}>()
</script>
