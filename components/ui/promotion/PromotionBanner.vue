<template>
  <div
    class="sticky top-0 z-[80] flex h-[3.25rem] cursor-pointer items-center justify-between gap-1 overflow-hidden bg-blue py-2 pl-4 text-sm text-white"
    :style="backgroundColorStyle"
    @click="togglePromotionList()">
    <div class="flex-1">
      <PromotionCountdown :until="currentPromotion.schedule.to" />
    </div>
    <PromotionHeadline
      v-if="headlineParts"
      :headline-parts="headlineParts"
      is-all-uppercased
      show-info-icon
      class="flex-1 justify-center" />
    <div class="flex-1">
      <div class="mr-[7.25rem] flex h-full justify-end">
        <PromotionProgress
          v-if="minOrderValue"
          :min-order-value="minOrderValue" />
        <ShowDealsButton
          v-else-if="category"
          :category="category"
          class="mr-3" />
      </div>
    </div>
    <MyDealsButton class="absolute right-0 top-0" />
  </div>
  <PromotionList :items="promotions" />
</template>

<script setup lang="ts">
const props = defineProps({
  promotions: {
    type: Object as PropType<Promotion[]>,
    required: true,
  },
})

const { currentPromotion } = usePromotionChange(props.promotions)
const { togglePromotionList } = usePromotionActions()

const headlineParts = computed(() => {
  return currentPromotion.value.customData.headlineChunks
})

const minOrderValue = computed(() => {
  return currentPromotion.value.customData.minOrderValue
})

const category = computed(() => {
  return currentPromotion.value.customData.category
})

const backgroundColorStyle = computed(() => {
  const cardColorHex = currentPromotion.value.customData.cardColorHex

  return { ...(!!cardColorHex && { backgroundColor: cardColorHex }) }
})
</script>
