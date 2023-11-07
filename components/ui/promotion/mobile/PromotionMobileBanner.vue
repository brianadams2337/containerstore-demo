<template>
  <PromotionMobileList v-if="isPromotionListShown" :items="promotions" />
  <FadeInTransition>
    <div
      v-if="!isPromotionListShown"
      class="sticky bottom-0 z-[80] flex max-h-32 cursor-pointer flex-col items-center justify-start overflow-hidden rounded-t-xl bg-blue p-4 text-sm text-white md:hidden"
      :style="getBackgroundColorStyle(currentPromotion.customData.colorHex)"
      @click="togglePromotionList()"
    >
      <div class="mb-2.5 flex w-full justify-between">
        <PromotionHeadline
          v-if="headlineParts && (!isFullProgress || isGreaterOrEquals('md'))"
          :headline-parts="headlineParts"
          size="sm"
          is-all-uppercased
          show-info-icon
          class="mr-4 flex-1"
        />
        <PromotionFullProgressLabel
          v-if="isFullProgress && isLessThan('md')"
          v-bind="{ minOrderValue, currentPromotion }"
        />
        <PromotionCountdown :until="currentPromotion.schedule.to" />
      </div>
      <PromotionProgress
        v-if="minOrderValue"
        v-bind="{ minOrderValue, currentPromotion }"
        is-full-width
      />
    </div>
  </FadeInTransition>
</template>

<script setup lang="ts">
const props = defineProps({
  promotions: {
    type: Array as PropType<Promotion[]>,
    required: true,
  },
})

const { isGreaterOrEquals, isLessThan } = useViewport()
const { currentPromotion } = usePromotionChange(props.promotions)
const { isFullProgress } = await usePromotionProgress(currentPromotion)

const { togglePromotionList, isPromotionListShown } = usePromotionActions()

const headlineParts = computed(() => {
  return currentPromotion.value.customData.headlineParts
})

const minOrderValue = computed(() => {
  return currentPromotion.value.customData.minOrderValue
})
</script>
