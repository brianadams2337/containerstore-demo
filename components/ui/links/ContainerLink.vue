<template>
  <DefaultLink
    :to="to"
    size="sm"
    class="border-gray-350 rounded-md border px-5 py-6">
    <div class="flex w-full items-center justify-between">
      <div class="mr-4 text-base font-semibold">
        <p>{{ header }}</p>
        <p v-if="subheader" class="text-secondary text-xs">{{ subheader }}</p>
      </div>
      <IconArrowRight class="h-4 w-4" />
    </div>
  </DefaultLink>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from '#vue-router'

defineProps({
  to: {
    type: [String, Object] as PropType<RouteLocationRaw>,
    required: true,
  },
  header: {
    type: String,
    required: true,
  },
  subheader: {
    type: String,
    default: '',
  },
})
</script>
