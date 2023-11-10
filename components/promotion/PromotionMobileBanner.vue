<template>
  <FadeInTransition>
    <PromotionMobileList v-if="isPromotionListShown" :items="promotions" />
    <div
      v-else
      class="fixed bottom-0 z-[80] flex max-h-32 w-full cursor-pointer flex-col items-center justify-start overflow-hidden rounded-t-xl bg-blue p-4 text-sm text-white lg:hidden"
      :style="getBackgroundColorStyle(currentPromotion.customData.colorHex)"
      @click="togglePromotionList()"
    >
      <div class="mb-2.5 flex w-full justify-between">
        <PromotionFullProgressLabel
          v-if="isFullProgress"
          v-bind="{ minOrderValue, currentPromotion }"
          is-small
        />
        <AutomaticDiscountMobileHeadline
          v-else-if="isAutomaticDiscount"
          :current-promotion="currentPromotion"
        />
        <PromotionHeadline
          v-else-if="headlineParts"
          :headline-parts="headlineParts"
          size="xs"
          show-info-icon
          class="mr-4 flex-1"
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
import { PromotionEffectType } from '@scayle/storefront-nuxt'

type Props = {
  promotions: Promotion[]
  currentPromotion: Promotion
  headlineParts?: string[]
  minOrderValue?: number
}

const props = withDefaults(defineProps<Props>(), {
  headlineParts: undefined,
  minOrderValue: undefined,
})

const { isFullProgress } = await usePromotionProgress(props.currentPromotion)

const { togglePromotionList, isPromotionListShown } = usePromotionActions()

const isAutomaticDiscount = computed(() => {
  const type = props.currentPromotion.effect.type
  return type === PromotionEffectType.AUTOMATIC_DISCOUNT
})
</script>
