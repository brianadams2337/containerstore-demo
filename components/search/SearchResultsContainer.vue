<template>
  <div
    id="search-results"
    class="absolute top-12 mt-2 w-full overflow-y-auto overscroll-none rounded border border-primary bg-white px-5">
    <FadeInTransition>
      <SearchResultSkeleton v-if="fetching" />
      <div v-else>
        <SearchResults
          :product-suggestions="productSuggestions"
          :categories="categories"
          :term="searchTerm" />
        <div v-if="resultsCount > 0" class="my-2 flex">
          <NuxtLink
            :to="{ name: 'search', query: { term: searchTerm } }"
            class="mx-auto rounded px-4 py-2 text-xs font-semibold underline transition-all duration-200 ease-in-out hover:bg-secondary-450 hover:font-bold"
            @click="emit('close')">
            {{ $t('search.more') }}
          </NuxtLink>
        </div>

        <section
          v-else-if="!resultsCount && searchTerm !== ''"
          class="px-8 py-4 text-center">
          <p>{{ $t('search.no_result') }}</p>
        </section>
      </div>
    </FadeInTransition>
  </div>
</template>

<script setup lang="ts">
import {
  TypeaheadBrandOrCategorySuggestion,
  TypeaheadProductSuggestion,
} from '@scayle/storefront-nuxt'

defineProps({
  fetching: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  brands: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  productSuggestions: {
    type: Array as PropType<TypeaheadProductSuggestion[]>,
    default: () => [],
  },
  categories: {
    type: Array as PropType<TypeaheadBrandOrCategorySuggestion[]>,
    default: () => [],
  },
  searchTerm: {
    type: String as PropType<string>,
    default: '',
  },
  resultsCount: {
    type: Number as PropType<number>,
    default: 0,
  },
})

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>
