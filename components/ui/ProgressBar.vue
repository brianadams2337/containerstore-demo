<template>
  <div
    class="relative w-full overflow-hidden"
    :class="[{ ...heightClasses, 'rounded-md': rounded }, backgroundColor]"
  >
    <div
      :class="[colorClasses, slantedBarClass]"
      :style="{ width: `${progress}%` }"
      class="h-full max-w-full"
    />
  </div>
</template>

<script setup lang="ts">
import { ProgressType } from '#imports'

type Props = {
  progress: number
  type?: ProgressType
  height?: 'xs' | 'sm' | 'md'
  backgroundColor?: string
  fullWidth?: boolean
  rounded?: boolean
  slanted?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: ProgressType.SUCCESS,
  height: 'sm',
  backgroundColor: 'bg-secondary-450',
  fullWidth: true,
  rounded: false,
  slanted: false,
})

const heightClasses = computed(() => ({
  'h-1': props.height === 'xs',
  'h-1.5': props.height === 'sm',
  'h-2.5': props.height === 'md',
}))

const colorClasses = computed(() => ({
  'bg-green-500': props.type === ProgressType.SUCCESS,
  'bg-yellow-400': props.type === ProgressType.WARN,
  'bg-red-500': props.type === ProgressType.DANGER,
  'bg-white': props.type === ProgressType.NEUTRAL,
}))

const slantedBarClass = computed(() => {
  if (props.progress > 100 || !props.slanted) {
    return ''
  }
  return '!h-0 border-t-[14px] border-r-[14px] border-white border-r-transparent bg-white/0'
})
</script>
