<template>
  <Transition
    :enter-active-class="`transition transition duration-${duration} ease-in-out`"
    :leave-active-class="`transition transition duration-${duration} ease-in-out`"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <slot />
  </Transition>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ duration?: number }>(), {
  duration: 200,
})
</script>
