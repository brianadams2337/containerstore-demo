<template>
  <DefaultLink
    :to="to"
    size="sm"
    class="rounded-md border border-gray-350 px-5 py-6">
    <div class="flex w-full items-center justify-between">
      <div class="mr-4 text-base font-semibold">
        <p>{{ header }}</p>
        <p v-if="subheader" class="text-xs text-secondary">{{ subheader }}</p>
      </div>
      <IconArrowRight class="h-4 w-4" />
    </div>
  </DefaultLink>
</template>

<script setup lang="ts">
import { RouteLocationRaw } from '#vue-router'

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
