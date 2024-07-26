<template>
  <TransitionGroup
    :tag="tag"
    name="fade-in-from-bottom"
    enter-active-class="transition transform ease-in duration-200"
    enter-from-class="translate-y-4 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
  >
    <slot />
  </TransitionGroup>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ tag?: string }>(), { tag: 'div' })
</script>
