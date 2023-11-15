import type { BasketItem, Product, Variant } from '@scayle/storefront-nuxt'

const collectBasketItems = (
  items: BasketItem<Product, Variant>[] = [],
  options: { listName: string; listId: string },
) => {
  return items.map(
    (basketItem: any): ProductListData => ({
      product: basketItem.product,
      list: {
        name: options.listName,
        id: options.listId,
      },
      quantity: basketItem.quantity,
    }),
  )
}

const useCheckoutEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => any,
) => ({
  trackBeginCheckout: (
    items: BasketItem<Product, Variant>[] = [],
    listName: string,
    listId: string,
  ) => {
    track('begin_checkout', {
      items: collectBasketItems(items, { listName, listId }),
    })
  },
  collectBasketItems,
})
export default useCheckoutEvents
