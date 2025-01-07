<template>
  <TransitionGroup
    :tag="tag"
    name="fade-in-from-bottom"
    :enter-active-class="`transition transform ease-in duration-${duration}`"
    enter-from-class="translate-y-4 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
  >
    <slot />
  </TransitionGroup>
</template>

<script setup lang="ts">
import type { TransitionDuration } from '~/modules/ui/types'

withDefaults(defineProps<{ tag?: string; duration?: TransitionDuration }>(), {
  tag: 'div',
  duration: 200,
})
</script>
