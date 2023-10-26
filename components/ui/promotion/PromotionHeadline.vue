<template>
  <div
    class="flex items-center text-white"
    :class="{ uppercase: isAllUppercased, '!items-start': isColumn }">
    <h1
      class="mr-1 flex flex-wrap items-center"
      :class="{ 'flex-col !items-start': isColumn }">
      <span
        class="mr-2 font-bold uppercase"
        :class="size !== 'sm' ? 'text-lg' : 'text-md'">
        {{ headline.offerText }}
      </span>
      <span
        class="text-base font-semibold"
        :class="size !== 'sm' ? 'text-sm' : 'text-xs'">
        {{ headline.conditionText }}
      </span>
    </h1>
    <IconInfoOutline v-if="showInfoIcon" class="h-5 w-5" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  headlineParts: {
    type: Array as PropType<string[]>,
    required: true,
  },
  showInfoIcon: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<'base' | 'sm'>,
    default: 'base',
  },
  isColumn: {
    type: Boolean,
    default: false,
  },
  isAllUppercased: {
    type: Boolean,
    default: false,
  },
})

const headline = computed(() => {
  const [offerText, conditionText] = props.headlineParts
  return { offerText, conditionText }
})
</script>
