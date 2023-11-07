<template>
  <div
    class="flex items-center text-white"
    :class="{ uppercase: isAllUppercased, '!items-start': isColumn }"
  >
    <h1
      class="mr-1 flex flex-wrap items-center"
      :class="{ 'flex-col !items-start': isColumn }"
    >
      <span class="mr-2 font-bold uppercase" :class="offerTextClass">
        {{ headline.offerText }}
      </span>
      <span class="text-xs font-semibold"> {{ headline.conditionText }}</span>
    </h1>
    <IconInfoOutline v-if="showInfoIcon" class="h-5 w-5" />
  </div>
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

const offerTextClass = computed(() => {
  return props.size !== PromotionHeadlineSize.SM ? 'text-lg' : 'text-md'
})
</script>
