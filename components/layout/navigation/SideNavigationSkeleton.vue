<template>
  <div
    class="ml-4 mt-2 block h-4 w-1/2 animate-pulse bg-gray-400"
    :class="classes"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  index: {
    type: Number,
    default: 0,
  },
})
const classes = computed(() => ({
  'w-1/4': props.index % 2 === 0,
  'w-3/4': props.index % 3 === 0,
}))
</script>
