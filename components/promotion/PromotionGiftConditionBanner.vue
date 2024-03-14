<template>
  <div
    class="flex items-center justify-between rounded-md px-4 py-2 text-white"
    :style="{ backgroundColor }"
  >
    <Headline size="xs" is-bold>{{ label }}</Headline>
    <PromotionCountdown :until="scheduleTo" borderless />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  backgroundColor: string
  label: string
  scheduleTo: string
}>()
</script>
