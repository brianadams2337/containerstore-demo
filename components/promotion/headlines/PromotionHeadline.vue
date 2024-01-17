<template>
  <h1 class="mr-1 flex flex-wrap items-center text-white" :class="coreClasses">
    <span class="mr-2 font-bold uppercase" :class="offerTextClass">
      {{ headline.offerText }}
    </span>
    <span class="text-xs" :class="conditionTextClass">
      {{ headline.conditionText }}
    </span>
    <IconInfoOutline v-if="showInfoIcon" class="ml-1 size-5" />
  </h1>
</template>

<script setup lang="ts">
import { PromotionHeadlineSize } from '#imports'

type Props = {
  headlineParts: string[]
  size?: PromotionHeadlineSize
  showInfoIcon?: boolean
  isColumn?: boolean
  isAllUppercased?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: PromotionHeadlineSize.BASE,
  showInfoIcon: false,
  isColumn: false,
  isAllUppercased: false,
})

const headline = computed(() => {
  const [offerText, conditionText] = props.headlineParts
  return { offerText, conditionText }
})

const isExtraSmall = computed(() => props.size === PromotionHeadlineSize.XS)

const offerTextClass = computed(() => ({
  'text-lg': props.size === PromotionHeadlineSize.BASE,
  'text-sm': props.size === PromotionHeadlineSize.SM,
  'text-xs': isExtraSmall.value,
}))

const coreClasses = computed(() => ({
  'flex-col !items-start': props.isColumn,
  uppercase: props.isAllUppercased,
}))

const conditionTextClass = computed(() => {
  return isExtraSmall.value
    ? 'font-medium first-letter:capitalize'
    : 'font-semibold'
})
</script>
