<template>
  <div class="flex items-center rounded border p-1">
    <IconClockOutline class="ml-1.5 mr-1 h-4 w-4 text-white" />
    <Countdown :until="until" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  until: {
    type: String,
    required: true,
  },
})
</script>
