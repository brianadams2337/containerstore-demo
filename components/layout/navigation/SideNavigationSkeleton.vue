<template>
  <div
    :class="{
      'ml-4 mt-2 block h-4 w-1/2 animate-pulse bg-gray-400': true,
      'w-1/4': index % 2 === 0,
      'w-3/4': index % 3 === 0,
    }" />
</template>

<script setup lang="ts">
defineProps({
  index: {
    type: Number,
    default: 0,
  },
})
</script>
