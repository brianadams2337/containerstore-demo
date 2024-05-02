<template>
  <div
    :ref="(element) => setBannerRef(element as HTMLElement)"
    data-test-id="promotion-banner"
    class="sticky top-0 z-[80] hidden h-[3.25rem] cursor-pointer items-center justify-between gap-1 overflow-hidden bg-blue py-2 pl-4 text-sm text-white lg:flex"
    :style="backgroundColorStyle"
    @click="togglePromotionList()"
  >
    <div class="flex-1">
      <PromotionCountdown v-if="expirationDate" :until="expirationDate" />
    </div>
    <PromotionHeadline
      v-if="headlineParts"
      :headline-parts="headlineParts"
      is-all-uppercased
      class="flex-1 justify-center"
    />
    <div class="flex h-full flex-1 justify-end">
      <PromotionProgress v-if="minOrderValue" class="mr-2.5" />
      <ShowDealsButton
        v-if="showDealsButton"
        :category="category"
        class="mr-3"
      />
      <MyDealsButton class="self-center" />
    </div>
  </div>
  <SFSlideInFromTopTransition>
    <PromotionList v-if="isPromotionListShown" :items="promotions" />
  </SFSlideInFromTopTransition>
  <SFOverlay v-if="isPromotionListShown" />
  <SFFadeInTransition>
    <PromotionMobileBanner
      :promotions="promotions"
      :show-deals-button-visible="showMobileDealsButton"
      :category="category"
    />
  </SFFadeInTransition>
</template>

<script setup lang="ts">
const props = defineProps<{ promotions: Promotion[] }>()

usePromotionChange(props.promotions)

const {
  backgroundColorStyle,
  minOrderValue,
  category,
  expirationDate,
  headlineParts,
} = useCurrentPromotion()

const { togglePromotionList, isPromotionListShown, setBannerRef } =
  usePromotionActions()

const { isMOVPromotionApplied, isFullProgress } = await usePromotionProgress()

const showDealsButton = computed<boolean>(() => {
  return Boolean(
    category.value &&
      (!minOrderValue.value ||
        (!isMOVPromotionApplied.value && isFullProgress.value)),
  )
})

const showMobileDealsButton = computed(() => {
  return Boolean(
    category.value &&
      !isMOVPromotionApplied.value &&
      isFullProgress.value &&
      minOrderValue.value,
  )
})
</script>
