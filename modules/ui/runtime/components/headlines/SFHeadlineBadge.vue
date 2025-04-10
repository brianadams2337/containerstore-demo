<template>
  <span class="rounded-full bg-gray-500 p-1 px-3 text-sm text-gray-200">
    {{ badge }}
  </span>
</template>

<script setup lang="ts">
defineProps<{ badge: number | string }>()
</script>
