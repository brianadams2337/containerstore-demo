<template>
  <div
    id="search-results"
    class="absolute top-12 mt-2 w-full overflow-y-auto overscroll-none rounded border border-primary bg-white p-5">
    <FadeInTransition>
      <SearchResultSkeleton v-if="fetching" />
      <div v-else>
        <div v-if="resultsCount > 0" class="my-2 flex flex-col">
          <SearchResults
            v-bind="{ productSuggestions, categories, resultsCount }"
            :term="searchTerm" />
          <DefaultLink
            :to="getSearchRoute(searchTerm)"
            raw
            class="mx-auto rounded px-4 py-2 text-xs font-semibold underline transition-all duration-200 ease-in-out hover:bg-secondary-450 hover:font-bold"
            @click="emit('close')">
            {{ $t('search.more') }}
          </DefaultLink>
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
import type {
  TypeaheadBrandOrCategorySuggestion,
  TypeaheadProductSuggestion,
} from '@scayle/storefront-nuxt'

defineProps({
  fetching: {
    type: Boolean,
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
    type: String,
    default: '',
  },
  resultsCount: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>
