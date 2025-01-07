<template>
  <SFLocalizedLink
    raw
    :to="to"
    class="group flex items-center space-x-3 rounded-md px-3 py-2.5 hover:bg-gray-100"
    :aria-label="label"
  >
    <component
      :is="icon"
      aria-hidden="true"
      class="size-4 text-gray-600 group-hover:text-black"
    />
    <span
      class="text-base font-variable leading-5 text-gray-600 group-hover:text-black"
    >
      {{ label }}
    </span>
  </SFLocalizedLink>
</template>

<script setup lang="ts">
import type { GlobalComponents } from 'vue'
import type { RouteLocationRaw } from '#vue-router'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'

type IconName = keyof {
  [K in keyof GlobalComponents as K extends `Icon${string}`
    ? K
    : never]: GlobalComponents[K]
}

defineProps<{
  to: RouteLocationRaw
  label: string
  icon: IconName
}>()
</script>
