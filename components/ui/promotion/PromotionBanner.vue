<template>
  <div
    class="sticky top-0 z-[80] flex h-[3.25rem] cursor-pointer items-center justify-between gap-1 overflow-hidden bg-blue py-2 pl-4 text-sm text-white"
    @click="togglePromotionList()">
    <div class="flex-1">
      <PromotionCountdown :until="firstPromotion.schedule.to" />
    </div>
    <PromotionHeadline
      v-if="firstPromotion.customData.headlineChunks"
      :headline-chunks="firstPromotion.customData.headlineChunks"
      is-all-uppercased
      show-info-icon
      class="flex-1 justify-center" />
    <div class="flex-1">
      <div class="mr-[7.25rem] flex h-full justify-end">
        <PromotionProgressBar
          v-if="firstPromotion.customData.minOrderValue"
          :min-order-value="+firstPromotion.customData.minOrderValue" />
        <ShowDealsButton
          v-else-if="firstPromotion.customData.category"
          :category="firstPromotion.customData.category"
          class="mr-3" />
      </div>
    </div>
    <MyDealsButton class="absolute right-0 top-0" />
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
