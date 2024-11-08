<template>
  <div
    class="relative z-[65] translate-y-0 transition-all duration-300 ease-in-out"
    :class="{ 'translate-y-[-3.25rem]': !isPromotionBannerShown }"
  >
    <div
      :ref="(element) => setBannerRef(element as HTMLElement, 'top')"
      data-testid="promotion-banner"
      class="sticky top-0 z-80 hidden h-13 w-full cursor-pointer items-center justify-between gap-1 overflow-hidden bg-blue py-2 pl-4 text-sm text-white lg:flex"
      :style="backgroundColorStyle"
      @keydown.enter="togglePromotionList()"
      @click="togglePromotionList()"
    >
      <div class="flex-1">
        <PromotionCountdown
          v-if="expirationDate"
          :time-until="expirationDate"
          data-testid="promotion-countdown"
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
        <!--
          When we have promotions with and without ShowDealsButton, each time the promotion changes, from no button to with button
          it will cause an http request for resolving the category url.
          By keeping it alive, it will only cause the HTTP call once for each category.
        -->
        <KeepAlive>
          <ShowDealsButton
            v-if="isDealsButtonShown"
            :key="`${currentPromotion?.id}-${category?.id}`"
            data-testid="show-deals-button"
            :category="category"
            class="mr-3"
          />
        </KeepAlive>
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
      :promotions="promotions"
      :category="category"
      :is-promotion-list-shown="isPromotionListShown"
    />
  </SFFadeInTransition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PromotionCountdown from './PromotionCountdown.vue'
import PromotionHeadline from './headlines/PromotionHeadline.vue'
import PromotionProgress from './progress/PromotionProgress.vue'
import ShowDealsButton from './buttons/ShowDealsButton.vue'
import MyDealsButton from './buttons/MyDealsButton.vue'
import PromotionMobileBanner from './PromotionMobileBanner.vue'
import PromotionList from './list/PromotionList.vue'
import TogglePromotionBannerButton from './buttons/TogglePromotionBannerButton.vue'
import {
  SFFadeInTransition,
  SFSlideInFromTopTransition,
  SFOverlay,
} from '#storefront-ui/components'
import {
  useCurrentPromotion,
  usePromotionActions,
  usePromotionChange,
  usePromotionProgress,
} from '~/composables'
import type { Promotion } from '~/types/promotion'

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
