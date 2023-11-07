<template>
  <div
    class="sticky top-0 z-[80] flex h-[3.25rem] cursor-pointer items-center justify-between gap-1 overflow-hidden bg-blue py-2 pl-4 text-sm text-white"
    :style="getBackgroundColorStyle(currentPromotion.customData.colorHex)"
    @click="togglePromotionList()"
  >
    <div class="flex-1">
      <PromotionCountdown :until="currentPromotion.schedule.to" />
    </div>
    <PromotionHeadline
      v-if="headlineParts"
      :headline-parts="headlineParts"
      is-all-uppercased
      show-info-icon
      class="flex-1 justify-center"
    />
    <div class="flex h-full flex-1 justify-end">
      <PromotionProgress
        v-if="minOrderValue"
        :min-order-value="minOrderValue"
        class="mr-2.5"
      />
      <ShowDealsButton v-else-if="category" :category="category" class="mr-3" />
      <MyDealsButton class="self-center" />
    </div>
  </div>
  <PromotionList :items="promotions" />
</template>

<script setup lang="ts">
const props = defineProps<{ promotions: Promotion[] }>()

const { currentPromotion } = usePromotionChange(props.promotions)
const { togglePromotionList } = usePromotionActions()

const headlineParts = computed(() => {
  return currentPromotion.value.customData?.headlineParts
})

const minOrderValue = computed(() => {
  return currentPromotion.value.customData?.minOrderValue
})

const category = computed(() => currentPromotion.value.customData?.category)
</script>
