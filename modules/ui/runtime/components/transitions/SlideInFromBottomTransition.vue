<template>
  <Transition
    :enter-active-class="`transform transition duration-${duration} ease-in-out`"
    enter-from-class="translate-y-full"
    enter-to-class="translate-y-0"
    leave-from-class="translate-y-0"
    leave-to-class="translate-y-full"
    :leave-active-class="`transform transition duration-${duration} ease-in-out`"
  >
    <slot />
  </Transition>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ duration?: number }>(), {
  duration: 500,
})
</script>
