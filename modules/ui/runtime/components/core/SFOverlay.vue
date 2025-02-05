<template>
  <Teleport to="#teleports">
    <div class="absolute top-0 z-50 size-full" :class="backgroundClass" />
  </Teleport>
</template>

<script setup lang="ts">
const { backgroundClass = 'bg-primary/50' } = defineProps<{
  backgroundClass?: string
}>()
</script>
