<template>
  <div class="flex flex-col">
    <span class="mr-2 text-xs font-bold uppercase">
      {{ headline.offerText }}</span
    >
    <p
      class="font-medium"
      :class="{ 'text-xs leading-4': isSmall || !isMOVPromotionApplied }"
    >
      <template v-if="isMOVPromotionApplied">
        🎉
        {{
          $t('promotion.full_progress_message', { amount: formattedDiscount })
        }}
      </template>
      <template v-else-if="isAutomaticDiscount">
        {{ $t('promotion.cart_reached', { discount: automaticDiscount }) }}
      </template>
      <template v-else-if="isBuyXGetY">
        {{ $t('promotion.cart_reached_for_gifts') }}
      </template>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCurrentPromotion, usePromotionProgress } from '~/composables'

withDefaults(defineProps<{ isSmall?: boolean }>(), { isSmall: false })

const {
  automaticDiscount,
  isAutomaticDiscount,
  isBuyXGetY,
  headlineParts,
  currentPromotion,
} = useCurrentPromotion()

const { formattedDiscount, isMOVPromotionApplied } =
  await usePromotionProgress(currentPromotion)

const headline = computed(() => {
  const [offerText, conditionText] = headlineParts.value ?? []
  return { offerText, conditionText }
})
</script>
