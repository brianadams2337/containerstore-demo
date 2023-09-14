<template>
  <transition
    :appear="appear"
    :enter-active-class="easeLinearClass"
    :leave-active-class="easeLinearClass"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    mode="out-in">
    <slot />
  </transition>
</template>

<script setup lang="ts">
const props = defineProps({
  appear: {
    type: Boolean,
    default: true,
  },
  duration: {
    type: Number,
    default: 200,
  },
})

const easeLinearClass = computed(() => {
  return `transition-all duration-${props.duration} ease-linear`
})
</script>
