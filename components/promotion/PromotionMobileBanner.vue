<template>
  <PromotionMobileList v-if="isPromotionListShown" :items="promotions" />
  <div
    v-else
    class="translate--y-0 fixed bottom-0 z-[80] flex max-h-32 w-full cursor-pointer flex-col items-center justify-start rounded-tr-lg bg-blue p-4 text-sm text-white transition-transform duration-300 ease-in-out lg:hidden"
    :style="backgroundColorStyle"
    :class="{ 'translate-y-full': !isPromotionBannerShown }"
    @click="togglePromotionList()"
  >
    <div class="overflow-hidden">
      <div
        class="flex w-full items-center justify-between gap-1"
        :class="minOrderValue && 'mb-2.5'"
      >
        <div class="text-balance">
          <PromotionFullProgressLabel v-if="isFullProgress" is-small />
          <AutomaticDiscountMobileHeadline
            v-else-if="minOrderValue"
            class="mr-2"
          />
          <PromotionHeadline
            v-else-if="headlineParts"
            :headline-parts="headlineParts"
            size="xs"
            class="mr-4 flex-1"
          />
        </div>
        <div class="flex w-min flex-col items-start justify-stretch gap-y-2">
          <PromotionCountdown
            v-if="expirationDate"
            :time-until="expirationDate"
            class="self-stretch"
          />
          <ShowDealsButton
            v-if="isDealsButtonShown"
            :category="category"
            class="self-stretch text-balance"
          />
        </div>
      </div>
      <PromotionProgress
        v-if="minOrderValue"
        v-bind="{ minOrderValue, currentPromotion }"
        is-full-width
      />
    </div>
    <TogglePromotionBannerButton
      v-model="isPromotionBannerShown"
      class="absolute left-0 mt-[-2.875rem] inline-flex !rounded-none !rounded-t-lg"
      is-mobile-view
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  useCurrentPromotion,
  usePromotionActions,
  usePromotionProgress,
} from '~/composables'

const props = defineProps<{
  promotions: Promotion[]
  category?: { ctaLabel: string; to: string }
}>()

const isPromotionBannerShown = ref(true)

const {
  headlineParts,
  minOrderValue,
  currentPromotion,
  backgroundColorStyle,
  expirationDate,
} = useCurrentPromotion()

const { isFullProgress, isMOVPromotionApplied } =
  await usePromotionProgress(currentPromotion)

const { togglePromotionList, isPromotionListShown } = usePromotionActions()

const isDealsButtonShown = computed<boolean>(() => {
  return Boolean(
    props.category &&
      !isMOVPromotionApplied.value &&
      isFullProgress.value &&
      minOrderValue.value,
  )
})
</script>
