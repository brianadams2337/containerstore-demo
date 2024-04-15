import {
  USE_DEFAULT_BREAKPOINTS_KEY,
  useContext,
} from '~/composables/cms/useProviderContext'

export const useStorefrontBreakpoints = () => {
  return useContext(USE_DEFAULT_BREAKPOINTS_KEY)
}
