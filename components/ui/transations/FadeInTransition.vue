<template>
  <Transition
    :enter-active-class="easeLinearClass"
    :leave-active-class="easeLinearClass"
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
const props = withDefaults(defineProps<{ duration?: number }>(), {
  duration: 200,
})

const easeLinearClass = computed(() => {
  return `transition-all duration-${props.duration} ease-linear`
})
</script>
