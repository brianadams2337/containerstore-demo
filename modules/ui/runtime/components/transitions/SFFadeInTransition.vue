<template>
  <Transition
    :enter-active-class="`transition-all duration-${duration} ease-linear`"
    :leave-active-class="`transition-all duration-${duration} ease-linear`"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    mode="out-in"
  >
    <slot />
  </Transition>
</template>

<script setup lang="ts">
import type { TransitionDuration } from '~/modules/ui/types'

const { duration = 200 } = defineProps<{ duration?: TransitionDuration }>()
</script>
