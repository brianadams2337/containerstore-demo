<template>
  <SFLink
    :to="to"
    size="sm"
    class="rounded-md border border-gray-350 px-5 py-6"
  >
    <div class="flex w-full items-center justify-between">
      <div class="mr-4 text-base font-semibold">
        <p>{{ header }}</p>
        <p v-if="subHeader" class="text-xs text-secondary">{{ subHeader }}</p>
      </div>
      <IconChevronRight class="size-6" />
    </div>
  </SFLink>
</template>

<script setup lang="ts">
import SFLink from './SFLink.vue'
import type { RouteLocationRaw } from '#vue-router'

defineProps<{
  to: RouteLocationRaw
  header: string
  subHeader?: string
}>()
</script>
