<template>
  <button
    class="flex items-center justify-center p-2 text-gray-500 shadow-sm transition-transform duration-300 focus-within:shadow-secondary hover:text-gray-900 focus-visible:shadow-outer-solid disabled:hover:translate-x-0 disabled:hover:text-gray-500"
    :class="{
      '-left-2 hover:translate-x-1': isLeft && translateOnHover,
      '-right-2 hover:-translate-x-1': !isLeft && translateOnHover,
      'rounded-r-full': isLeft !== invertedRadius,
      'rounded-l-full': isLeft === invertedRadius,
    }"
    :disabled="disabled"
  >
    <component :is="icon" class="size-4" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconChevronLeft, IconChevronRight } from '#components'

const { direction, invertedRadius = false } = defineProps<{
  disabled: boolean
  direction: 'left' | 'right'
  invertedRadius?: boolean
  translateOnHover?: boolean
}>()

const isLeft = computed(() => direction === 'left')
const icon = computed(() => (isLeft.value ? IconChevronLeft : IconChevronRight))
</script>
