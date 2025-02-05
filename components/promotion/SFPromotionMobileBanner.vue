<template>
  <SFPromotionMobileList v-if="isPromotionListShown" :items="promotions" />
  <div
    v-else
    ref="bottomBanner"
    class="fixed bottom-0 z-80 flex max-h-32 w-full translate-y-0 cursor-pointer flex-col items-center justify-start rounded-tr-lg bg-blue p-4 text-sm text-white transition-transform duration-300 ease-in-out lg:hidden"
    :style="backgroundColorStyle"
    :class="{ 'translate-y-full': !isPromotionBannerShown }"
    data-testid="promotion-banner-mobile"
    @click="togglePromotionList()"
    @keydown.enter="togglePromotionList()"
  >
    <div class="overflow-hidden">
      <div
        class="flex w-full items-center justify-between gap-1"
        :class="minOrderValue && 'mb-2.5'"
      >
        <div class="text-balance">
          <SFPromotionFullProgressLabel v-if="isFullProgress" is-small />
          <SFAutomaticDiscountMobileHeadline
            v-else-if="minOrderValue"
            class="mr-2"
          />
          <SFPromotionHeadline
            v-else-if="headlineParts"
            :headline-parts="headlineParts"
            size="xs"
            class="mr-4 flex-1"
          />
        </div>
        <div class="flex w-min flex-col items-start justify-stretch gap-y-2">
          <SFPromotionCountdown
            v-if="expirationDate"
            :time-until="expirationDate"
            class="self-stretch"
            data-testid="promotion-countdown-mobile"
          />
          <!--
            When we have promotions with and without ShowDealsButton, each time the promotion changes, from no button to with button
            it will cause an http request for resolving the category url.
            By keeping it alive, it will only cause the HTTP call once for each category.
          -->
          <KeepAlive>
            <SFShowDealsButton
              v-if="isDealsButtonShown"
              :key="`${currentPromotion?.id}-${category?.id}`"
              :category="category"
              class="self-stretch text-balance"
            />
          </KeepAlive>
        </div>
      </div>
      <SFPromotionProgress
        v-if="minOrderValue"
        :min-order-value="minOrderValue"
        :current-promotion="currentPromotion"
        is-full-width
      />
    </div>
    <SFTogglePromotionBannerButton
      class="absolute left-0 -mt-13 inline-flex !rounded-none !rounded-t-lg"
      data-testid="toggle-promo-button-mobile"
      is-mobile-view
    />
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import SFPromotionMobileList from './list/SFPromotionMobileList.vue'
import SFPromotionFullProgressLabel from './progress/SFPromotionFullProgressLabel.vue'
import SFAutomaticDiscountMobileHeadline from './headlines/SFAutomaticDiscountMobileHeadline.vue'
import SFPromotionHeadline from './headlines/SFPromotionHeadline.vue'
import SFPromotionCountdown from './SFPromotionCountdown.vue'
import SFShowDealsButton from './buttons/SFShowDealsButton.vue'
import SFPromotionProgress from './progress/SFPromotionProgress.vue'
import SFTogglePromotionBannerButton from './buttons/SFTogglePromotionBannerButton.vue'
import {
  useCurrentPromotion,
  usePromotionActions,
  usePromotionProgress,
  usePromotionBanner,
} from '~/composables'
import type { Promotion } from '~/types/promotion'

const { category } = defineProps<{
  promotions: Promotion[]
  category?: Promotion['customData']['category']
}>()

const { togglePromotionList, isPromotionListShown, isPromotionBannerShown } =
  usePromotionActions()

const { setBannerHeight } = usePromotionBanner()

const bottomBannerRef = useTemplateRef('bottomBanner')

const { height } = useElementSize(bottomBannerRef)

watch(height, setBannerHeight)

const {
  headlineParts,
  minOrderValue,
  currentPromotion,
  backgroundColorStyle,
  expirationDate,
} = useCurrentPromotion()

const { isFullProgress, isMOVPromotionApplied } =
  usePromotionProgress(currentPromotion)

const isDealsButtonShown = computed<boolean>(() => {
  return Boolean(
    category &&
      !isMOVPromotionApplied.value &&
      isFullProgress.value &&
      minOrderValue.value,
  )
})
</script>
