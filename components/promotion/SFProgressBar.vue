<template>
  <progress
    class="h-1.5 w-full rounded-full border"
    max="100"
    :value="progress"
    :style="progressBarStyle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FALLBACK_COLOR } from '~/utils'

const { color = FALLBACK_COLOR } = defineProps<{
  progress: number
  color?: string
}>()

const progressBarStyle = computed(() => {
  return {
    backgroundColor: '#fff',
    borderColor: color,
  }
})
</script>

<style scoped lang="css">
progress::-moz-progress-bar {
  background-color: v-bind(color);
}

progress::-webkit-progress-bar {
  background-color: #fff;
}

progress::-webkit-progress-value {
  background-color: v-bind(color);
}
</style>
