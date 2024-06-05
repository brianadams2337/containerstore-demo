<template>
  <PromotionCard
    v-bind="{ backgroundColor, promotion }"
    :promotion="promotion"
    class="relative flex flex-col items-start rounded-md bg-blue px-4 py-3 text-white"
  >
    <template #default="{ headlineParts, scheduledTo }">
      <div class="flex w-full items-center justify-between">
        <PromotionHeadline
          v-if="headlineParts"
          :headline-parts="headlineParts"
          size="sm"
          is-column
          class="mb-2"
        />
        <PromotionCountdown :time-until="scheduledTo" />
      </div>
      <div
        v-if="isPriorityBadgeShown"
        class="rounded-md border px-2 py-1 text-2xs font-semibold uppercase"
      >
        {{ $t('promotion.highest_priority') }}
      </div>
      <ClientOnly>
        <template #fallback>
          <div v-if="minOrderAmount" class="mt-3.5 flex w-full flex-col">
            <SFSkeletonLoader
              v-for="n in 3"
              :key="n"
              type="custom"
              class="my-1 h-2 w-full rounded-sm"
            />
          </div>
        </template>
        <SFFadeInTransition>
          <ProductPromotionProgressLabel
            v-bind="{ promotion, isGiftAddedToBasket, areGiftConditionsMet }"
          />
        </SFFadeInTransition>
      </ClientOnly>
    </template>
  </PromotionCard>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { getBackgroundColorStyle } from '~/utils/promotion'
import { usePromotionProgress } from '~/composables'

type Props = {
  promotion: Promotion
  isPriorityBadgeShown?: boolean
  isGiftAddedToBasket?: boolean
  areGiftConditionsMet?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isPriorityBadgeShown: false,
  isGiftAddedToBasket: false,
  areGiftConditionsMet: false,
})

const { minOrderAmount } = await usePromotionProgress(toRef(props.promotion))

const backgroundColor = computed(() => {
  const colorHex = props.promotion.customData.colorHex

  return getBackgroundColorStyle(colorHex).backgroundColor
})
</script>
