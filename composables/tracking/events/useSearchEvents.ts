import type { SearchEntity } from '@scayle/storefront-nuxt'

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
  const { getSearchSuggestionPath } = useRouteHelpers()

  return {
    trackSearch,
    trackSearchSuggestionClick: (
      searchTerm: string,
      suggestion: SearchEntity,
    ) => {
      if (!suggestion.type) {
        return
      }

      trackSearch({
        searchTerm,
        suggestion: getSuggestionName(suggestion),
        searchAction: isProductSuggestion(suggestion)
          ? 'suggested_product'
          : 'suggested_category',
        searchDestination: getSearchSuggestionPath(suggestion) || '',
      })
    },
  }
}

export default useSearchEvents
