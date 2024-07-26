<template>
  <div
    class="relative z-[65] translate-y-0 transition-all duration-300 ease-in-out"
    :class="{ 'translate-y-[-3.25rem]': !isPromotionBannerShown }"
  >
    <div
      :ref="(element) => setBannerRef(element as HTMLElement, 'top')"
      data-testid="promotion-banner"
      class="sticky top-0 z-80 hidden h-[3.25rem] w-full cursor-pointer items-center justify-between gap-1 overflow-hidden bg-blue py-2 pl-4 text-sm text-white lg:flex"
      :style="backgroundColorStyle"
      @keydown.enter="togglePromotionList()"
      @click="togglePromotionList()"
    >
      <div class="flex-1">
        <PromotionCountdown
          v-if="expirationDate"
          :time-until="expirationDate"
        />
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
          v-if="isDealsButtonShown"
          data-test-id="show-deals-button"
          :category="category"
          class="mr-3"
        />
        <MyDealsButton class="self-center" />
      </div>
    </div>
    <SFFadeInTransition>
      <TogglePromotionBannerButton
        v-if="!isPromotionListShown"
        class="absolute top-[3.25rem] hidden !rounded-none !rounded-b-md lg:inline-flex"
      />
    </SFFadeInTransition>
  </div>
  <SFSlideInFromTopTransition>
    <PromotionList v-if="isPromotionListShown" :items="promotions" />
  </SFSlideInFromTopTransition>
  <SFOverlay v-if="isPromotionListShown" />
  <SFFadeInTransition>
    <PromotionMobileBanner
      v-bind="{ promotions, category, isPromotionListShown }"
    />
  </SFFadeInTransition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  useCurrentPromotion,
  usePromotionActions,
  usePromotionChange,
  usePromotionProgress,
} from '~/composables'

const props = defineProps<{ promotions: Promotion[] }>()

usePromotionChange(props.promotions)

const {
  backgroundColorStyle,
  minOrderValue,
  category,
  expirationDate,
  headlineParts,
  currentPromotion,
} = useCurrentPromotion()

const {
  togglePromotionList,
  isPromotionListShown,
  setBannerRef,
  isPromotionBannerShown,
} = usePromotionActions()

const { isMOVPromotionApplied, isFullProgress } =
  usePromotionProgress(currentPromotion)

const isDealsButtonShown = computed<boolean>(() => {
  return Boolean(
    category.value &&
      (!minOrderValue.value ||
        (!isMOVPromotionApplied.value && isFullProgress.value)),
  )
})
</script>
