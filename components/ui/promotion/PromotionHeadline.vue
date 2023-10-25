<template>
  <div class="flex items-center text-white">
    <Headline tag="h1" size="lg" class="mr-1">{{ title }}</Headline>
    <IconInfoOutline class="h-5 w-5" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>
