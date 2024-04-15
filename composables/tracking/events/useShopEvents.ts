import { version } from '../../../package.json'

const SHOP_GENDER: 'male' | 'female' | 'other' | '' = ''

const useShopEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => any,
) => {
  const currentShop = useCurrentShop().value
  const currency = currentShop!.currency
  const locale = currentShop!.locale
  const shopId = currentShop!.shopId

  return {
    trackShopInit: () => {
      return track('shop_init', {
        shop_currency: currency,
        shop_id: shopId,
        shop_gender: SHOP_GENDER,
        shop_version: version,
        locale: locale?.replace('_', '-'),
        landing_page: import.meta.client ? window.location.href : '',
        referrer: import.meta.client ? window.document.referrer : '',
        parameter: import.meta.client ? window.location.search || '' : '',
        origin: 'web',
      })
    },

    trackShopChange: () => {
      return track('shop_change', {
        shop_id: String(shopId),
        shop_gender: SHOP_GENDER,
        locale: locale.replace(/_/g, '-'),
        shop_currency: currency,
      })
    },
  }
}

export default useShopEvents
