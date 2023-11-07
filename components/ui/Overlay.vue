<template>
  <Teleport to="body">
    <div class="absolute top-0 z-50 h-full w-full" :class="backgroundClass" />
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  backgroundClass: {
    type: String,
    default: 'bg-primary/50',
  },
})

defineOptions({ name: 'AppOverlay' })
</script>
