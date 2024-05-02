<template>
  <div class="animate-pulse bg-gray-200" :class="classes" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SkeletonType } from '#storefront-ui'

type Props = {
  type?: SkeletonType
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: SkeletonType.BUTTON,
  fullWidth: false,
})

const isButton = computed(() => props.type === SkeletonType.BUTTON)
const isHeadline = computed(() => props.type === SkeletonType.HEADLINE)

const classes = computed(() => ({
  'h-12 rounded-md': isButton.value,
  'h-8': isHeadline.value,
  'w-32 md:w-64': !props.fullWidth && (isHeadline.value || isButton.value),
  'md:w-64': !props.fullWidth && isHeadline.value,
  'w-full': props.fullWidth,
}))
</script>
