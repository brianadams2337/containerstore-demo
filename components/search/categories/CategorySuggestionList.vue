<template>
  <section class="space-y-3">
    <div
      class="flex items-center space-x-1 text-md font-semibold text-gray-900"
    >
      <span>{{ $t('search.categories') }}</span>
      <span
        class="ml-0.5 inline-flex h-4 items-center rounded-full bg-gray-900 px-2 text-sm leading-none text-white-smoke"
      >
        {{ categorySuggestions.length }}
      </span>
    </div>
    <ul class="space-y-2" role="presentation">
      <li
        v-for="suggestion in categorySuggestions"
        :key="suggestion.categorySuggestion.category.id"
        role="presentation"
      >
        <CategorySuggestion
          role="option"
          :category-suggestion="suggestion"
          @click:result="emit('click:result', suggestion)"
        />
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { CategorySearchSuggestion } from '@scayle/storefront-nuxt'
import CategorySuggestion from './CategorySuggestion.vue'

type Props = {
  categorySuggestions: CategorySearchSuggestion[]
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'click:result', suggestion: CategorySearchSuggestion): void
}>()
</script>
