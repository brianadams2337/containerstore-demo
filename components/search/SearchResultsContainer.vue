<template>
  <div
    id="search-results"
    role="popup"
    class="fixed z-10 mt-2 w-full space-y-5 border-gray-300 bg-white p-4 max-lg:bottom-0 max-lg:top-20 max-lg:mt-5 max-lg:overflow-y-auto lg:absolute lg:rounded-lg lg:border lg:shadow-md"
    data-testid="search-results-flyout"
  >
    <SFFadeInTransition>
      <SearchResultSkeleton v-if="showSuggestionsLoader" />
      <div v-else>
        <div v-if="resultsCount && resultsCount > 0" class="flex flex-col">
          <SearchResults
            :products="products"
            :categories="categories"
            :navigation-items="navigationItems"
            :search-term="searchQuery"
            @click:result="emit('click:result', $event)"
            @close="emit('close')"
          />
        </div>
        <section
          v-else-if="!resultsCount && searchQuery"
          class="px-8 py-4 text-center"
          data-testid="no-result"
        >
          <p>{{ $t('search.no_result') }}</p>
        </section>
      </div>
    </SFFadeInTransition>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type {
  SearchEntity,
  CategorySearchSuggestion,
  ProductSearchSuggestion,
  NavigationItemSuggestion,
} from '@scayle/storefront-nuxt'
import SearchResultSkeleton from './SearchResultSkeleton.vue'
import { SFFadeInTransition } from '#storefront-ui/components'

const SearchResults = defineAsyncComponent(() => import('./SearchResults.vue'))
const emit = defineEmits<{
  close: []
  'click:result': [event: SearchEntity]
}>()

const { products, categories, navigationItems } = defineProps<{
  searchQuery: string
  products: ProductSearchSuggestion[]
  categories: CategorySearchSuggestion[]
  navigationItems: NavigationItemSuggestion[]
  showSuggestionsLoader: boolean
}>()

const resultsCount = computed(() => {
  return products.length + navigationItems.length + categories.length
})
</script>
