<template>
  <div
    class="mr-1 flex flex-wrap items-center text-sm text-white"
    :class="coreClasses"
  >
    <span class="mr-2 font-bold uppercase" :class="offerTextClass">
      {{ headline.offerText }}
    </span>
    <span class="font-variable" :class="conditionTextClass">
      {{ headline.conditionText }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PromotionHeadlineSize } from '~/constants/promotion'

const {
  size = PromotionHeadlineSize.BASE,
  isColumn = false,
  isAllUppercased = false,
  headlineParts,
} = defineProps<{
  headlineParts: string[]
  size?: PromotionHeadlineSize
  isColumn?: boolean
  isAllUppercased?: boolean
}>()

const headline = computed(() => {
  const [offerText, conditionText] = headlineParts
  return { offerText, conditionText }
})

const isExtraSmall = computed(() => size === PromotionHeadlineSize.XS)

const offerTextClass = computed(() => ({
  'text-lg': size === PromotionHeadlineSize.BASE,
  'text-sm': size === PromotionHeadlineSize.SM,
  'text-xs': isExtraSmall.value,
}))

const coreClasses = computed(() => ({
  'flex-col !items-start': isColumn,
  uppercase: isAllUppercased,
}))

const conditionTextClass = computed(() => {
  return isExtraSmall.value
    ? 'font-medium first-letter:capitalize'
    : 'font-semibold'
})
</script>
