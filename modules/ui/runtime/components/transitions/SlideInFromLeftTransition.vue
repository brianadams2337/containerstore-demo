<template>
  <Transition
    :enter-active-class="easeInOutClass"
    :leave-active-class="easeInOutClass"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <slot />
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{ duration?: number }>(), {
  duration: 200,
})

const easeInOutClass = computed(() => {
  return `transition transition duration-${props.duration} ease-in-out`
})
</script>
