<template>
  <ul :id="id" role="menu">
    <slot />
  </ul>
</template>
<script setup lang="ts">
defineProps<{ id: string }>()
</script>
