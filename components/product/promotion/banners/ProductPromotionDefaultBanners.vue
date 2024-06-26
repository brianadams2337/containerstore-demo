<template>
  <div class="flex w-full flex-col">
    <ProductPromotionDefaultBannersItem
      v-for="promotion in applicablePromotions"
      :key="promotion.id"
      v-bind="{ promotion, isGiftAddedToBasket, areGiftConditionsMet }"
      :is-priority-badge-shown="isHighestPriority(promotion.priority)"
      class="mb-2 w-full"
    />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'
import { useProductPromotions } from '~/composables'

const props = defineProps<{ product: Product }>()

const {
  applicablePromotions,
  isHighestPriority,
  isGiftAddedToBasket,
  areGiftConditionsMet,
} = useProductPromotions(props.product)
</script>
