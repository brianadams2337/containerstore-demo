<template>
  <div
    class="sticky top-0 z-60 flex h-[3.25rem] items-center justify-between gap-1 bg-blue px-4 py-2 text-sm text-white">
    <PromotionCountdown :until="firstPromotion.schedule.to" />
    <PromotionHeadlineButton
      :title="String(firstPromotion.customData.headerText)" />
    <PromotionProgressBar
      v-if="firstPromotion.customData.minOrderValue"
      :min-order-value="+firstPromotion.customData.minOrderValue" />
    <ShowDealsButton v-else />
    <PromotionList :items="promotions" />
  </div>
</template>

<script setup lang="ts">
import { Promotion } from '@scayle/storefront-nuxt'

const props = defineProps({
  promotions: {
    type: Object as PropType<Promotion[]>,
    required: true,
  },
})

const firstPromotion = computed(() => props.promotions[2])
</script>
