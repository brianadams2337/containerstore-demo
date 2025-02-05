<template>
  <div
    class="animate-pulse bg-gray-200"
    :class="{
      'h-12 rounded-md': isButton,
      'h-8': isHeadline,
      'w-32 md:w-64': !fullWidth && (isHeadline || isButton),
      'md:w-64': !fullWidth && isHeadline,
      'w-full': fullWidth,
    }"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SkeletonType } from '#storefront-ui'

const { type = SkeletonType.BUTTON, fullWidth = false } = defineProps<{
  type?: SkeletonType
  fullWidth?: boolean
}>()

const isButton = computed(() => type === SkeletonType.BUTTON)
const isHeadline = computed(() => type === SkeletonType.HEADLINE)
</script>
