import type { SearchEntity } from '@scayle/storefront-nuxt'
import { useRouteHelpers } from '~/composables/useRouteHelpers'
import { getSuggestionName, isProductSuggestion } from '~/utils'
import type {
  TrackingEvent,
  TrackingPayload,
  TrackSearchEventParams,
} from '~/types/tracking'

const useSearchEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => void,
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
