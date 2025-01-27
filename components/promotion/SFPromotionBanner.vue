<template>
  <div
    class="relative z-[65] translate-y-0 transition-all duration-300 ease-in-out"
    :class="{ 'lg:-translate-y-13': !isPromotionBannerShown }"
  >
    <div
      :ref="(element) => setTopBannerRef(element as HTMLElement)"
      data-testid="promotion-banner"
      class="sticky top-0 z-80 hidden h-13 w-full cursor-pointer items-center justify-between gap-1 overflow-hidden bg-blue py-2 pl-4 text-sm text-white lg:flex"
      :style="backgroundColorStyle"
      @keydown.enter="togglePromotionList()"
      @click="togglePromotionList()"
    >
      <div class="flex-1">
        <SFPromotionCountdown
          v-if="expirationDate"
          :time-until="expirationDate"
          data-testid="promotion-countdown"
        />
      </div>
      <SFPromotionHeadline
        v-if="headlineParts"
        :headline-parts="headlineParts"
        is-all-uppercased
        class="flex-1 justify-center"
      />
      <div class="flex h-full flex-1 justify-end">
        <SFPromotionProgress v-if="minOrderValue" class="mr-2.5" />
        <!--
          When we have promotions with and without ShowDealsButton, each time the promotion changes, from no button to with button
          it will cause an http request for resolving the category url.
          By keeping it alive, it will only cause the HTTP call once for each category.
        -->
        <KeepAlive>
          <SFShowDealsButton
            v-if="isDealsButtonShown"
            :key="`${currentPromotion?.id}-${category?.id}`"
            data-testid="show-deals-button"
            :category="category"
            class="mr-3"
          />
        </KeepAlive>
        <SFMyDealsButton class="self-center" />
      </div>
    </div>
    <SFFadeInTransition>
      <SFTogglePromotionBannerButton
        v-if="!isPromotionListShown"
        class="absolute top-13 hidden !rounded-none !rounded-b-md lg:inline-flex"
      />
    </SFFadeInTransition>
  </div>
  <SFSlideInFromTopTransition>
    <SFPromotionList v-if="isPromotionListShown" :items="promotions" />
  </SFSlideInFromTopTransition>
  <SFOverlay v-if="isPromotionListShown" />
  <SFFadeInTransition>
    <SFPromotionMobileBanner
      :promotions="promotions"
      :category="category"
      :is-promotion-list-shown="isPromotionListShown"
    />
  </SFFadeInTransition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SFPromotionCountdown from './SFPromotionCountdown.vue'
import SFPromotionHeadline from './headlines/SFPromotionHeadline.vue'
import SFPromotionProgress from './progress/SFPromotionProgress.vue'
import SFShowDealsButton from './buttons/SFShowDealsButton.vue'
import SFMyDealsButton from './buttons/SFMyDealsButton.vue'
import SFPromotionMobileBanner from './SFPromotionMobileBanner.vue'
import SFPromotionList from './list/SFPromotionList.vue'
import SFTogglePromotionBannerButton from './buttons/SFTogglePromotionBannerButton.vue'
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
  usePromotionBanner,
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

const { togglePromotionList, isPromotionListShown, isPromotionBannerShown } =
  usePromotionActions()

const { setTopBannerRef } = usePromotionBanner()

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
