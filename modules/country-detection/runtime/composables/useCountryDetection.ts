import { onMounted, ref, toValue, computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'
import type { PublicShopConfig } from '@scayle/storefront-nuxt'
import { getCurrentCountryFromTimezone } from '../utils/currentCountry'
import {
  useAvailableShops,
  useCurrentShop,
  useUser,
} from '#storefront/composables'

/**
 * Get the shops matching a region code
 * Will return shop of fallbackShopId configured in the composable parameter.
 * @param region The two character region code to search for
 * @param availableShops All available shops
 * @param fallbackShopId The shop ID to use if there are no shops that match the detected region.
 */
const getShopsForRegion = (
  region: string | undefined,
  availableShops: PublicShopConfig[],
  fallbackShopId?: number,
) => {
  if (!region) {
    return []
  }
  const shopsForRegion = availableShops.filter(
    (shop) => new Intl.Locale(shop.locale).region === region,
  )
  if (shopsForRegion.length === 0 && fallbackShopId) {
    return availableShops.filter((shop) => shop.shopId === fallbackShopId)
  }

  return shopsForRegion
}

export interface CountryDetectionParams {
  /**
   * An optional function to get the detected country code.
   * Defaults to a function that gets the country code from the user's timezone.
   * @returns Returns the detected country code
   */
  getDetectedCountryCode?: () =>
    | Promise<string | undefined>
    | (string | undefined)
  /**
   * An optional function to determine whether the user should be prompted to switch shops.
   * @param detectedRegion - The actual region of the user
   * @param currentRegion - Region of the current shop
   * @returns Boolean whether or not the user should be prompted to switch shops
   */
  shouldPromptUser?: (
    detectedRegion: string,
    currentRegion: string,
  ) => Promise<boolean> | boolean

  /**
   * The shop ID to use if there are no shops that match the detected region.
   *
   * When the detected region does not match any available shop, the shop with the
   * `fallbackShopId` will be suggested instead. This ensures that a valid shop is
   * always suggested, even when no match for the region is found.
   */
  fallbackShopId?: number
}

/**
 * A composable that provides logic for detecting the user's country and suggesting shops matching the detected country.
 * @param {CountryDetectionParams} params - An object containing the parameters for the composable.
 * @returns {object} - The returned object contains:
 * @property {Ref<PublicShopConfig[]>} suggestedShops - An array of shops matching the detected region or the fallback shop.
 * @property {Ref<string | undefined>} detectedRegion - The detected region code (based on the user's location).
 * @property {Ref<boolean>} suggestionActive - A boolean indicating whether a suggestion for switching shops should be active.
 * @property {Function} markUserAsNotPrompted - A function to reset the user's prompt status, indicating that they have not been prompted for a shop switch.
 * @property {Function} markUserAsPrompted - A function to mark that the user has been prompted to switch shops.
 * @property {ComputedRef<boolean>} hasPromptedUser - A computed reference indicating whether the user has already been prompted to switch shops (persisted in session storage).
 */
export function useCountryDetection({
  getDetectedCountryCode = getCurrentCountryFromTimezone,
  shouldPromptUser,
  fallbackShopId,
}: CountryDetectionParams) {
  const currentShop = useCurrentShop()
  const availableShops = useAvailableShops()
  const user = useUser()

  const suggestionActive = ref(false)

  const hasPromptedUser = useSessionStorage<boolean>(
    'hasPromptedCountrySwitch',
    null,
    {
      serializer: {
        read: (value) => (value ? JSON.parse(value) : false),
        write: (value) => JSON.stringify(value),
      },
    },
  )

  const markUserAsPrompted = () => {
    hasPromptedUser.value = true
  }

  const suggestedShops = ref<PublicShopConfig[]>([])
  const detectedRegion = ref()

  onMounted(async () => {
    detectedRegion.value = await getDetectedCountryCode()

    suggestedShops.value = getShopsForRegion(
      detectedRegion.value,
      availableShops.value,
      fallbackShopId,
    ).filter((shop) => shop.shopId !== currentShop.value.shopId)

    suggestionActive.value = await shouldShowSuggestion()

    async function shouldShowSuggestion() {
      const currentRegion = new Intl.Locale(currentShop.value.locale).region
      const regionMismatch =
        detectedRegion.value &&
        currentRegion &&
        detectedRegion.value !== currentRegion

      if (suggestedShops.value.length === 0) {
        return false
      }

      if (!regionMismatch) {
        return false
      }

      if (shouldPromptUser) {
        return await shouldPromptUser(detectedRegion.value, currentRegion)
      }

      const isLoggedIn = (await user).isLoggedIn
      // Do not show the modal if the user is logged in or has already dismissed it
      return !(toValue(isLoggedIn) || toValue(hasPromptedUser))
    }
  })

  return {
    suggestedShops,
    detectedRegion,
    suggestionActive,
    markUserAsPrompted,
    hasPromptedUser: computed(() => hasPromptedUser.value),
  }
}
