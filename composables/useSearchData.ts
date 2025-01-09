import { ref, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useStorefrontSearch } from '#storefront/composables'
import {
  isCategorySuggestion,
  isNavigationItemSuggestion,
  isProductSuggestion,
} from '~/utils'
import { DEBOUNCED_SEARCH_DURATION } from '~/constants'

export function useSearchData() {
  const key = 'storefront-search'
  const searchQuery = ref<string>('')

  const { data, resolveSearch, getSearchSuggestions, status, ...searchData } =
    useStorefrontSearch(searchQuery, {}, key)

  const allSuggestions = computed(() => data?.value?.suggestions ?? [])

  const products = computed(() => {
    return allSuggestions.value.filter(isProductSuggestion)
  })

  const categories = computed(() => {
    return allSuggestions.value.filter(isCategorySuggestion)
  })

  const navigationItems = computed(() =>
    allSuggestions.value.filter(isNavigationItemSuggestion),
  )

  const totalCount = computed(() => {
    return (
      products.value.length +
      categories.value.length +
      navigationItems.value.length
    )
  })

  const noSuggestions = computed(() => totalCount.value === 0)

  const hasSearchQuery = computed(() => searchQuery.value?.length)

  const debouncedSearch = useDebounceFn(async () => {
    if (!hasSearchQuery.value) {
      status.value = 'idle'
      return
    }
    await getSearchSuggestions()
  }, DEBOUNCED_SEARCH_DURATION)

  const showSuggestionsLoader = computed(() => {
    return (
      status.value === 'pending' && (!searchQuery.value || noSuggestions.value)
    )
  })

  return {
    ...searchData,
    searchQuery,
    data,
    status,
    products,
    categories,
    navigationItems,
    noSuggestions,
    totalCount,
    hasSearchQuery,
    debouncedSearch,
    showSuggestionsLoader,
  }
}
