<template>
  <div class="grid grid-cols-4 gap-1">
    <span
      class="h-1.5 rounded bg-gray-350"
      :class="{ 'bg-red-600': strength.id >= 0 && value?.length }"
    />
    <span
      class="h-1.5 rounded bg-gray-350"
      :class="{ 'bg-orange-600': strength.id >= 1 }"
    />
    <span
      class="h-1.5 rounded bg-gray-350"
      :class="{ 'bg-yellow-300': strength.id >= 2 }"
    />
    <span
      class="h-1.5 rounded bg-gray-350"
      :class="{ 'bg-green-500': strength.id >= 3 }"
    />
  </div>
</template>

<script setup lang="ts">
import { passwordStrength } from 'check-password-strength'

const props = defineProps<{ value: string }>()

const strength = computed(() => passwordStrength(props.value))
</script>
