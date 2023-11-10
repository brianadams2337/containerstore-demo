<template>
  <div
    class="flex items-center justify-center"
    :class="isFullWidth ? 'w-full !justify-start' : 'w-[19.5rem]'"
  >
    <template v-if="!isFullProgress || isLessThan('lg')">
      <ProgressBar
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
    <PromotionFullProgressLabel
      v-if="isFullProgress"
      v-bind="{ minOrderValue, currentPromotion }"
      class="hidden lg:block"
    />
  </div>
</template>

<script setup lang="ts">
type Props = {
  currentPromotion: Promotion
  minOrderValue: number
  isFullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), { isFullWidth: false })

const { isLessThan } = useViewport()

const { progress, isFullProgress, formattedAmountLeft } =
  await usePromotionProgress(props.currentPromotion)
</script>
