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
      <IconArrowRight class="size-4" />
    </div>
  </SFLink>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from '#vue-router'

type Props = {
  to: RouteLocationRaw
  header: string
  subHeader?: string
}

withDefaults(defineProps<Props>(), { subHeader: undefined })
</script>
