<template>
  <Transition
    v-bind="activeClasses"
    enter-from-class="translate-y-full"
    enter-to-class="translate-y-0"
    leave-from-class="translate-y-0"
    leave-to-class="translate-y-full"
  >
    <slot />
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ duration?: number }>(), {
  duration: 500,
})

const activeClasses = computed(() => ({
  enterActiveClass: `transform transition duration-${props.duration} ease-in-out`,
  leaveActiveClass: `transform transition duration-${props.duration} ease-in-out`,
}))
</script>
