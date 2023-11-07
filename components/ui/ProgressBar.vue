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
const props = defineProps({
  progress: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    validator: (type: string) => {
      return ['success', 'warn', 'danger', 'neutral'].includes(type)
    },
    default: 'success',
  },
  fullWidth: {
    type: Boolean,
    default: true,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    validator: (height: string) => ['xs', 'sm', 'md'].includes(height),
    default: 'sm',
  },
  backgroundColor: {
    type: String,
    default: 'bg-secondary-450',
  },
  slanted: {
    type: Boolean,
    default: false,
  },
})

const heightClasses = computed(() => ({
  'h-1': props.height === 'xs',
  'h-1.5': props.height === 'sm',
  'h-2.5': props.height === 'md',
}))

const colorClasses = computed(() => ({
  'bg-green-500': props.type === 'success',
  'bg-yellow-400': props.type === 'warn',
  'bg-red-500': props.type === 'danger',
  'bg-white': props.type === 'neutral',
}))

const slantedBarClass = computed(() => {
  if (!props.progress || !props.slanted) {
    return ''
  }
  return '!h-0 border-t-[14px] border-r-[14px] border-white border-r-transparent bg-white/0'
})
</script>
