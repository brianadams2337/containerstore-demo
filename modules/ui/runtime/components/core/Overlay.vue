<template>
  <Teleport to="body">
    <div class="absolute top-0 z-50 size-full" :class="backgroundClass" />
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ backgroundClass?: string }>(), {
  backgroundClass: 'bg-primary/50',
})
</script>
