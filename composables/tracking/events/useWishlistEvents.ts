import {
  ProductActionData,
  TrackAddToWishListParams,
  TrackRemoveFromWishListParams,
  TrackingEvent,
  TrackingPayload,
  ProductListData,
} from '~/types/tracking'

const useWishlistEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => any,
) => {
  const currencyCode = useCurrentShop().value!.currency

  return {
    trackRemoveFromWishlist: ({
      product,
      quantity = 1,
      listingMetaData,
      category,
      index = 1,
      pagePayload,
    }: TrackRemoveFromWishListParams) => {
      const payload: ProductActionData = {
        product: { ...product, index },
        quantity,
        list: listingMetaData,
        currencyCode,
      }
      if (category) {
        const { id = -1, name = '' } = category
        payload.category = { id: id > -1 ? id.toString() : '', name }
      }

      payload.pagePayload = pagePayload
      track('remove_from_wishlist', payload)
    },
    trackAddToWishlist: ({
      product,
      quantity = 1,
      listingMetaData,
      category,
      variant,
      index = 1,
      pagePayload,
    }: TrackAddToWishListParams) => {
      const payload: ProductActionData = {
        product: { ...product, index },
        quantity,
        list: listingMetaData,
        currencyCode,
      }

      if (category) {
        const { id = -1, name = '' } = category
        payload.category = { id: id > -1 ? id.toString() : '', name }
      }
      if (variant) {
        payload.variant = variant
      }

      payload.pagePayload = pagePayload
      track('add_to_wishlist', payload)
    },
    trackWishlist: (items: ProductListData[]) => {
      track('wishlist', {
        currencyCode,
        items,
      })
    },
  }
}
export default useWishlistEvents
