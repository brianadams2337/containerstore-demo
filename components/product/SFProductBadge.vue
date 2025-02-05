<template>
  <div
    class="z-10 inline-flex h-6 w-max items-center overflow-hidden rounded-3xl bg-white px-2.5 text-sm font-variable capitalize text-gray-900"
  >
    <template v-if="typeof label === 'string'">
      {{ label }}
    </template>
    <template v-else>
      {{ label.firstLabel }}
      <span class="mx-1 h-full text-3xl font-[100] text-gray-100">|</span>
      {{ label.secondLabel }}
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { text } = defineProps<{ text: string | string[] }>()

const label = computed<string | Record<'firstLabel' | 'secondLabel', string>>(
  () => {
    if (!Array.isArray(text)) {
      return text
    }
    if (text.length === 1) {
      return text[0]
    }
    const [firstLabel, secondLabel] = text
    return { firstLabel, secondLabel }
  },
)
</script>
