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
    <SFPromotionFullProgressLabel
      v-if="isFullProgress"
      class="hidden lg:block"
    />
  </div>
</template>

<script setup lang="ts">
import SFPromotionFullProgressLabel from './SFPromotionFullProgressLabel.vue'
import { useCurrentPromotion, usePromotionProgress } from '~/composables'
import { useDefaultBreakpoints } from '#storefront-ui/composables'
import { SFProgressBar } from '#storefront-ui/components'

const { isFullWidth = false } = defineProps<{ isFullWidth?: boolean }>()

const { currentPromotion } = useCurrentPromotion()
const { progress, isFullProgress, formattedAmountLeft } =
  usePromotionProgress(currentPromotion)

const { isSmaller } = useDefaultBreakpoints()
</script>
