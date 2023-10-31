<template>
  <PromotionMobileList v-if="isPromotionListShown" :items="promotions" />
  <FadeInTransition>
    <div
      v-if="!isPromotionListShown"
      class="sticky bottom-0 z-[80] flex max-h-32 cursor-pointer flex-col items-center justify-start overflow-hidden rounded-t-xl bg-blue p-4 text-sm text-white md:hidden"
      :style="backgroundColorStyle"
      @click="togglePromotionList()">
      <div class="mb-2.5 flex w-full justify-between">
        <PromotionHeadline
          v-if="headlineParts"
          :headline-parts="headlineParts"
          size="sm"
          is-all-uppercased
          show-info-icon
          class="mr-4 flex-1" />
        <PromotionCountdown :until="currentPromotion.schedule.to" />
      </div>
      <PromotionProgress
        v-if="minOrderValue"
        :min-order-value="minOrderValue"
        is-full-width />
    </div>
  </FadeInTransition>
</template>

<script setup lang="ts">
const props = defineProps({
  promotions: {
    type: Object as PropType<Promotion[]>,
    required: true,
  },
})

const { currentPromotion } = usePromotionChange(props.promotions)
const { togglePromotionList, isPromotionListShown } = usePromotionActions()

const headlineParts = computed(() => {
  return currentPromotion.value.customData.headlineChunks
})

const minOrderValue = computed(() => {
  return currentPromotion.value.customData.minOrderValue
})

const backgroundColorStyle = computed(() => {
  const cardColorHex = currentPromotion.value.customData.cardColorHex

  return { ...(!!cardColorHex && { backgroundColor: cardColorHex }) }
})
</script>
