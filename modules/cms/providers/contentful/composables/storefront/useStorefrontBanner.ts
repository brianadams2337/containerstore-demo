import {
  USE_BANNER_KEY,
  useContext,
} from '~/composables/cms/useProviderContext'

export const useStorefrontBanner = () => {
  return useContext(USE_BANNER_KEY)
}
