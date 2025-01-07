<template>
  <section class="space-y-3">
    <div
      class="flex items-center space-x-1 text-md font-semibold text-gray-900"
    >
      <span>{{ $t('search.navigation_items') }}</span>
      <span
        class="ml-0.5 inline-flex h-4 items-center rounded-full bg-gray-900 px-2 text-sm leading-none text-white-smoke"
      >
        {{ navigationItemSuggestions.length }}
      </span>
    </div>
    <ul class="space-y-2" role="presentation">
      <li
        v-for="suggestion in navigationItemSuggestions"
        :key="suggestion.navigationItemSuggestion.navigationItem.id"
        role="presentation"
      >
        <SFNavigationItemSuggestion
          role="option"
          :navigation-item-suggestion="suggestion"
          :search-term="searchTerm"
          raw
          @click:result="emit('click:result', suggestion)"
        />
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { NavigationItemSuggestion as NavigationItemSuggestionType } from '@scayle/storefront-core'
import SFNavigationItemSuggestion from './SFNavigationItemSuggestion.vue'

type Props = {
  navigationItemSuggestions: NavigationItemSuggestionType[]
  searchTerm: string
}
defineProps<Props>()
const emit = defineEmits<{
  (e: 'click:result', suggestion: NavigationItemSuggestionType): void
}>()
</script>
