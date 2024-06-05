import { debounce } from 'radash'
import { type SearchV2With } from '@scayle/storefront-nuxt'

type SearchParams = Partial<{ categoryId: number; with: SearchV2With }>

export function useSearchData(
  key = 'storefront-search',
  params?: SearchParams,
) {
  const searchQuery = useState<string>('search-query', () => '')

  const {
    getSearchRoute,
    localizedNavigateTo,
    getProductDetailRoute,
    buildCategorySuggestionRoute,
  } = useRouteHelpers()

  const { trackSearchSuggestionClick } = useTrackingEvents()

  const {
    data,
    resolveSearch,
    getSearchSuggestions,
    pending: fetching,
    ...searchData
  } = useStorefrontSearch(searchQuery, { key, params })

  const allSuggestions = computed(() => data?.value?.suggestions ?? [])

  const products = computed(() => {
    return allSuggestions.value.filter(isProductSuggestion)
  })

  const categories = computed(() => {
    return allSuggestions.value.filter(isCategorySuggestion)
  })

  const totalCount = computed(() => {
    return products.value.length + categories.value.length
  })

  const noSuggestions = computed(() => totalCount.value === 0)

  const resolveSearchAndRedirect = async () => {
    const resolved = await resolveSearch()

    if (!resolved?.type) {
      return await localizedNavigateTo(getSearchRoute(searchQuery.value))
    }

    trackSearchSuggestionClick(searchQuery.value, resolved)

    if (isProductSuggestion(resolved)) {
      const { product } = resolved.productSuggestion
      return await localizedNavigateTo(getProductDetailRoute(product))
    }

    if (isCategorySuggestion(resolved)) {
      const route = buildCategorySuggestionRoute(resolved)
      return await localizedNavigateTo(route)
    }

    return await localizedNavigateTo(getSearchRoute(searchQuery.value))
  }

  const hasSearchQuery = computed(() => searchQuery.value?.length)

  const debouncedSearch = debounce(
    { delay: DEBOUNCED_SEARCH_DURATION },
    async () => {
      if (!hasSearchQuery.value) {
        fetching.value = false
        return
      }
      await getSearchSuggestions()
    },
  )

  const showSuggestionsLoader = computed(() => {
    return fetching.value && (!searchQuery.value || noSuggestions.value)
  })

  return {
    ...searchData,
    searchQuery,
    data,
    fetching,
    products,
    categories,
    noSuggestions,
    totalCount,
    resolveSearchAndRedirect,
    hasSearchQuery,
    debouncedSearch,
    showSuggestionsLoader,
  }
}
