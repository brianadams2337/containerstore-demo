<template>
  <div
    id="search-results"
    class="absolute top-12 mt-2 w-full overflow-y-auto overscroll-none rounded border border-primary bg-white px-5 pb-1.5 pt-4"
  >
    <FadeInTransition>
      <SearchResultSkeleton v-if="fetching" />
      <div v-else>
        <div v-if="resultsCount > 0" class="my-2 flex flex-col">
          <SearchResults
            v-bind="{ productSuggestions, categories, resultsCount }"
            :term="searchTerm"
            @click:result="emit('click:result', $event)"
          />
          <DefaultLink
            :to="getSearchRoute(searchTerm)"
            raw
            class="mx-auto mt-3 rounded px-4 py-2 text-xs font-semibold underline transition-all duration-200 ease-in-out hover:bg-secondary-450 hover:font-bold"
            @click="emit('close')"
          >
            {{ $t('search.more') }}
          </DefaultLink>
        </div>
        <section
          v-else-if="!resultsCount && searchTerm !== ''"
          class="px-8 py-4 text-center"
        >
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
  BrandOrCategorySuggestion,
  ProductSuggestion,
} from '@scayle/storefront-nuxt'

type Suggestion = BrandOrCategorySuggestion | ProductSuggestion

type Props = {
  fetching?: boolean
  brands?: TypeaheadBrandOrCategorySuggestion[]
  searchTerm?: string
  resultsCount?: number
  productSuggestions?: TypeaheadProductSuggestion[]
  categories?: TypeaheadBrandOrCategorySuggestion[]
}

withDefaults(defineProps<Props>(), {
  fetching: false,
  brands: () => [],
  productSuggestions: () => [],
  categories: () => [],
  searchTerm: '',
  resultsCount: 0,
})

const emit = defineEmits<{
  close: []
  'click:result': [event: Suggestion]
}>()
const { getSearchRoute } = useRouteHelpers()
</script>
