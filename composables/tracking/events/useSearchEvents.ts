import {
  BrandOrCategorySuggestion,
  ProductSuggestion,
} from '@scayle/storefront-nuxt'

const useSearchEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => any,
) => {
  const trackSearch = ({
    searchTerm,
    suggestion = '',
    searchAction,
    searchDestination = '',
  }: TrackSearchEventParams) => {
    track('search', {
      search_term: searchTerm,
      search_term_completed: suggestion || '',
      search_action: searchAction,
      search_destination: searchDestination,
    })
  }

  return {
    trackSearch,

    trackSearchSuggestionClick: (
      searchTerm: string,
      suggestion: ProductSuggestion | BrandOrCategorySuggestion,
    ) => {
      if (!suggestion) {
        return
      }
      const product = (suggestion as ProductSuggestion).product

      trackSearch({
        searchTerm,
        suggestion: suggestion.suggestion,
        searchAction: product ? 'suggested_product' : 'suggested_category',
        searchDestination: String(
          toLocalePath(getSearchSuggestionPath(suggestion) || ''),
        ),
      })
    },
  }
}

export default useSearchEvents
