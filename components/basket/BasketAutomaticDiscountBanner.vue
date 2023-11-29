<template>
  <div
    v-if="hasFailedConditions"
    class="flex justify-between rounded-md px-4 py-2 text-white"
    :style="backgroundColorStyle"
  >
    <Headline size="xs" is-bold>
      {{ $t('basket.promotion.choose_free_gift') }}
    </Headline>
    <PromotionCountdown
      v-if="promotion"
      :until="promotion.schedule.to"
      borderless
    />
  </div>
</template>

<script setup lang="ts">
import { type BasketItem } from '@scayle/storefront-nuxt'

const props = defineProps<{ basketItem: BasketItem }>()

const basketItem = computed(() => props.basketItem)

const { promotion, backgroundColorStyle, hasFailedConditions } =
  useBasketItemPromotion(basketItem)
</script>
