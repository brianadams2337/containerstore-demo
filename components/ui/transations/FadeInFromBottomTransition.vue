<template>
  <transition
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="opacity-100 translate-y-0"
    enter-active-class="transform transition duration-200 ease-in-out"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
    leave-active-class="transform transition duration-200 ease-in-out"
    :appear="appear">
    <slot />
  </transition>
</template>

<script setup lang="ts">
defineProps({
  appear: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
})
</script>
