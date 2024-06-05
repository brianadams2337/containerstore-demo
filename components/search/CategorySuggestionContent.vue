<template>
  <div class="flex flex-col items-start overflow-hidden">
    <span class="mr-2 truncate text-sm font-semibold text-primary">
      {{ category.name }}
    </span>
    <div v-if="filters.length" class="mt-1 flex flex-row items-center">
      <IconFilter class="mr-2 size-4" />
      <span
        v-for="label in getSearchFilterLabels(filters)"
        :key="label"
        class="mr-1 rounded-md border border-gray-400 px-1 text-2xs font-normal"
      >
        {{ label }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Category } from '@scayle/storefront-nuxt'
import type { CategoryFilter } from '~/utils/search'

defineProps<{ category: Category; filters: CategoryFilter[] }>()
</script>
