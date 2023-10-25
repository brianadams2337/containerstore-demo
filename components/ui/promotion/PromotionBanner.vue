<template>
  <div
    class="sticky top-0 z-[80] flex h-[3.25rem] cursor-pointer items-center justify-between gap-1 overflow-hidden bg-blue px-4 py-2 text-sm text-white"
    @click="togglePromotionList()">
    <PromotionCountdown :until="firstPromotion.schedule.to" />
    <PromotionHeadline :title="String(firstPromotion.customData.headerText)" />
    <div class="flex">
      <PromotionProgressBar
        v-if="firstPromotion.customData.minOrderValue"
        :min-order-value="+firstPromotion.customData.minOrderValue" />
      <ShowDealsButton v-else />
      <div class="relative ml-2 flex h-full">
        <div class="absolute -top-4 h-14 w-[1px] bg-primary/25" />
        <MyDealsButton />
      </div>
    </div>
  </div>
  <PromotionList :items="promotions" />
</template>

<script setup lang="ts">
import { Promotion } from '@scayle/storefront-nuxt'

const props = defineProps({
  promotions: {
    type: Object as PropType<Promotion[]>,
    required: true,
  },
})

const { togglePromotionList } = usePromotionActions()

const firstPromotion = computed(() => props.promotions[2])
</script>
