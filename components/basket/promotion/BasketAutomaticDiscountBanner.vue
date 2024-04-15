<template>
  <div
    v-if="hasFailedConditions"
    class="flex flex-wrap justify-between gap-y-[.125rem] rounded-md px-4 py-2 text-white sm:flex-nowrap md:items-center lg:flex-nowrap"
    :style="backgroundColorStyle"
  >
    <PromotionHeadline
      v-if="headlineParts"
      :headline-parts="headlineParts"
      size="sm"
      class="text-balance md:basis-1/2 lg:basis-5/12 xl:basis-7/12"
    />
    <PromotionCountdown
      v-if="promotion"
      :until="promotion.schedule.to"
      class="md:basis-1/2 md:items-center md:justify-end lg:basis-7/12 xl:basis-5/12"
      borderless
    />
  </div>
</template>

<script setup lang="ts">
import { type BasketItem } from '@scayle/storefront-nuxt'

const props = defineProps<{ basketItem: BasketItem }>()

const basketItem = computed(() => props.basketItem)

const { promotion, backgroundColorStyle, hasFailedConditions, headlineParts } =
  await useBasketItemPromotion(basketItem)
</script>
