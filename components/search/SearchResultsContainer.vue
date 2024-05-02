<template>
  <div
    id="search-results"
    class="absolute top-12 mt-2 w-full overflow-y-auto overscroll-none rounded border border-primary bg-white p-4"
  >
    <SFFadeInTransition>
      <SearchResultSkeleton v-if="showSuggestionsLoader" />
      <div v-else>
        <div v-if="resultsCount > 0" class="flex flex-col">
          <SearchResults
            v-bind="{ products, categories, resultsCount }"
            @click:result="emit('click:result', $event)"
          />
          <SFLink
            :to="getSearchRoute(searchQuery)"
            raw
            class="mx-auto mt-3 rounded px-4 py-2 text-xs font-semibold underline transition-all duration-200 ease-in-out hover:bg-secondary-450 hover:font-bold"
            @click="emit('close')"
          >
            {{ $t('search.more') }}
          </SFLink>
        </div>
        <section
          v-else-if="!resultsCount && searchQuery"
          class="px-8 py-4 text-center"
        >
          <p>{{ $t('search.no_result') }}</p>
        </section>
      </div>
    </SFFadeInTransition>
  </div>
</template>

<script setup lang="ts">
import type { SearchEntity } from '@scayle/storefront-nuxt'

const emit = defineEmits<{
  close: []
  'click:result': [event: SearchEntity]
}>()

const { getSearchRoute } = useRouteHelpers()

const {
  showSuggestionsLoader,
  categories,
  products,
  searchQuery,
  totalCount: resultsCount,
} = useSearchData()
</script>
