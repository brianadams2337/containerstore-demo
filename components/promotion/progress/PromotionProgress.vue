<template>
  <div
    class="flex items-center justify-center"
    :class="isFullWidth ? 'w-full !justify-start' : 'w-[19.5rem]'"
  >
    <template v-if="!isFullProgress || isSmaller('lg')">
      <SFProgressBar
        :progress="progress"
        rounded
        slanted
        type="neutral"
        :full-width="isFullWidth"
        :class="!isFullWidth && '!max-w-[12.5rem]'"
        background-color="bg-white/20"
      />
      <span class="ml-2 hidden w-28 font-semibold lg:inline-block">
        {{ $t('promotion.progress_left', { amount: formattedAmountLeft }) }}
      </span>
    </template>
    <PromotionFullProgressLabel v-if="isFullProgress" class="hidden lg:block" />
  </div>
</template>

<script setup lang="ts">
import {
  useCurrentPromotion,
  useDefaultBreakpoints,
  usePromotionProgress,
} from '~/composables'

withDefaults(defineProps<{ isFullWidth?: boolean }>(), { isFullWidth: false })

const { currentPromotion } = useCurrentPromotion()
const { progress, isFullProgress, formattedAmountLeft } =
  usePromotionProgress(currentPromotion)

const { isSmaller } = useDefaultBreakpoints()
</script>
