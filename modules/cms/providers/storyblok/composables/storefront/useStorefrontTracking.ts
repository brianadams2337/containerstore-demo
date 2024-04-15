import {
  USE_TRACKING_EVENTS_KEY,
  useContext,
} from '~/composables/cms/useProviderContext'

export const useStorefrontTracking = () => {
  return useContext(USE_TRACKING_EVENTS_KEY)
}
