<template>
  <div
    class="flex h-full flex-1 cursor-pointer px-6 text-gray-800"
    :class="{ '!text-black': isActive }"
    @click="emit('click:tab')">
    <p class="m-auto text-sm">
      {{ heading }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  heading: { type: String, required: true },
  isActive: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (e: 'click:tab'): void
}>()
</script>
