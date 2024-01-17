<template>
  <div
    class="relative z-30 h-12 rounded border border-primary/0 transition-all duration-500"
    :class="inputActive ? 'w-[21rem] border-primary/100' : 'w-12 delay-100'"
    @click="inputActive = true"
    @keydown.esc="resetAndClose"
  >
    <label class="sr-only">{{ $t('search.placeholder') }}</label>
    <IconSearchBold
      class="absolute inset-y-2.5 left-2 size-6"
      :class="inputActive ? 'pointer-events-none' : 'cursor-pointer'"
      @click="inputActive = true"
    />

    <FadeInTransition :duration="100">
      <span
        v-if="searchQuery"
        class="absolute right-0 flex h-full cursor-pointer items-center justify-center px-2.5 py-2"
      >
        <IconCloseBold class="size-4" @click="resetSearch" @mousedown.prevent />
      </span>
    </FadeInTransition>
    <input
      id="search"
      ref="input"
      v-model="searchQuery"
      :placeholder="$t('search.placeholder')"
      data-test-id="header-search-input"
      type="search"
      autocomplete="off"
      class="w-full appearance-none overflow-hidden rounded border border-none border-transparent py-3 pl-10 pr-4 text-sm font-medium outline-none search-decoration-none focus:ring-0"
      :class="{
        'pr-10': searchQuery,
        'w-0': !inputActive,
      }"
      @focus="showSuggestions = true"
      @keydown.enter="openSearchPage"
    />

    <Flyout :is-open="isFlyoutOpened">
      <SearchResultsContainer
        v-if="showSuggestions"
        :brands="brands"
        :categories="categories"
        :fetching="pending"
        :product-suggestions="products"
        :results-count="count"
        :search-term="searchQuery"
        @close="resetAndClose"
        @click:result="trackSuggestionClickAndClose"
      />
    </Flyout>
  </div>
</template>

<script setup lang="ts">
import { useFocus } from '@vueuse/core'
import type {
  BrandOrCategorySuggestion,
  ProductSuggestion,
} from '@scayle/storefront-nuxt'

const { data, search, searchQuery, resetSearch, pending } = useSearch({
  key: 'header-search',
  params: {
    with: {
      products: {
        attributes: {
          withKey: ['color', 'brand', 'name'],
        },
        priceRange: true,
        categories: 'all',
      },
      categories: {
        parents: 'all',
        children: 10,
      },
    },
  },
})

const input = ref()

const { trackSearchSuggestionClick } = useTrackingEvents()
const { getSearchRoute, localizedNavigateTo } = useRouteHelpers()

const showSuggestions = ref(false)
watchEffect(() => {
  showSuggestions.value = searchQuery.value.length >= MIN_CHARS_FOR_SEARCH
})

const { focused: inputActive } = useFocus(input)

watch(inputActive, (val) => !val && resetSearch())

const { products, categories, brands } = useTypeaheadSuggestions(data)

const debouncedSearch = useDebounce(
  { delay: DEBOUNCED_SEARCH_DURATION },
  async (value: string) => {
    if (value === '' || value.length < MIN_CHARS_FOR_SEARCH) {
      return
    }
    await search({
      term: searchQuery.value,
      productLimit: PRODUCT_LIMIT,
    })
  },
)

watch(
  () => searchQuery.value,
  (query) => (!query ? resetSearch() : debouncedSearch(query)),
)

const resetAndClose = () => {
  searchQuery.value = ''
  resetSearch()
  inputActive.value = false
}

const trackSuggestionClickAndClose = (
  suggestion: ProductSuggestion | BrandOrCategorySuggestion,
) => {
  trackSearchSuggestionClick(searchQuery.value, suggestion)
  resetAndClose()
}

const openSearchPage = async () => {
  await localizedNavigateTo(getSearchRoute(searchQuery.value))
  resetAndClose()
}

const count = computed(() => data?.value?.suggestions.length)
const isFlyoutOpened = computed(() => {
  return !!(
    products.value.length ||
    categories.value.length ||
    searchQuery.value.length
  )
})
</script>
