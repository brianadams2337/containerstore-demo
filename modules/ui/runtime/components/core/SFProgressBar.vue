<template>
  <div
    class="relative w-full overflow-hidden"
    :class="[{ ...heightClasses, 'rounded-md': rounded }, backgroundColor]"
  >
    <div :class="colorClasses" :style="barStyle" class="h-full max-w-full" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ProgressType } from '#storefront-ui'

const {
  type = ProgressType.SUCCESS,
  height = 'sm',
  barColorStyle,
  progress,
  backgroundColor = 'bg-secondary-450',
  rounded = false,
  slanted = false,
} = defineProps<{
  progress: number
  type?: ProgressType
  height?: 'xs' | 'sm' | 'md'
  barColorStyle?: { backgroundColor: string; borderColor: string }
  backgroundColor?: string
  rounded?: boolean
  slanted?: boolean
}>()

const heightClasses = computed(() => ({
  'h-1': height === 'xs',
  'h-1.5': height === 'sm',
  'h-2.5': height === 'md',
}))

const colorClasses = computed(() => ({
  'bg-status-success': type === ProgressType.SUCCESS,
  'bg-status-alert': type === ProgressType.WARN,
  'bg-status-error': type === ProgressType.DANGER,
  'bg-white': type === ProgressType.NEUTRAL,
}))

const barStyle = computed(() => ({
  width: `${progress}%`,
  ...(barColorStyle && {
    borderTopWidth: '14px',
    borderRightWidth: '14px',
    borderColor: barColorStyle.borderColor,
    backgroundColor:
      progress >= 100 ? barColorStyle.borderColor : 'transparent',
    ...(slanted && { height: 0, borderRightColor: 'transparent' }),
  }),
}))
</script>
