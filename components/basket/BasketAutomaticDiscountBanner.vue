<template>
  <div
    v-if="isShown && promotion"
    class="flex justify-between rounded-md px-4 py-2 text-white"
    :style="backgroundColorStyle"
  >
    <Headline size="xs" is-bold>
      {{ $t('basket.promotion.choose_free_gift') }}
    </Headline>
    <PromotionCountdown :until="promotion.schedule.to" borderless />
  </div>
</template>

<script setup lang="ts">
import { type BasketItem } from '@scayle/storefront-nuxt'

const props = defineProps<{ basketItem: BasketItem }>()

const basketItem = computed(() => props.basketItem)

const {
  isAutomaticDiscount,
  promotion,
  backgroundColorStyle,
  hasFailedConditions,
} = useBasketItemPromotion(basketItem)

const isShown = computed(() => {
  return isAutomaticDiscount.value && hasFailedConditions.value
})
</script>
