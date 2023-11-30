<template>
  <PromotionMobileList v-if="isPromotionListShown" :items="promotions" />
  <div
    v-else
    class="fixed bottom-0 z-[80] flex max-h-32 w-full cursor-pointer flex-col items-center justify-start overflow-hidden rounded-t-xl bg-blue p-4 text-sm text-white lg:hidden"
    :style="backgroundColorStyle"
    @click="togglePromotionList()"
  >
    <div
      class="flex w-full justify-between"
      :class="isAutomaticDiscount && 'mb-2.5'"
    >
      <PromotionFullProgressLabel v-if="isFullProgress" is-small />
      <AutomaticDiscountMobileHeadline v-else-if="isAutomaticDiscount" />
      <PromotionHeadline
        v-else-if="headlineParts"
        :headline-parts="headlineParts"
        size="xs"
        show-info-icon
        class="mr-4 flex-1"
      />
      <PromotionCountdown v-if="expirationDate" :until="expirationDate" />
    </div>
    <PromotionProgress
      v-if="minOrderValue"
      v-bind="{ minOrderValue, currentPromotion }"
      is-full-width
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ promotions: Promotion[] }>()

const { isFullProgress } = await usePromotionProgress()

const {
  headlineParts,
  minOrderValue,
  currentPromotion,
  isAutomaticDiscount,
  backgroundColorStyle,
  expirationDate,
} = useCurrentPromotion()

const { togglePromotionList, isPromotionListShown } = usePromotionActions()
</script>
