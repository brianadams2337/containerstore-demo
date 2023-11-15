import type {
  BasketItem,
  Product,
  Variant,
  BasketTotalPrice,
} from '@scayle/storefront-nuxt'

const useBasketEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => any,
) => {
  const currencyCode = useCurrentShop().value!.currency

  return {
    trackBasketItems: (items: BasketItem[] = []) => {
      const basketPayload: BasketData = {
        items: items || [],
        total_campaign_reduction_with_tax: 0.0,
        total_sale_reduction_with_tax: 0.0,
        total_with_tax: 0.0,
        total_without_tax: 0.0,
      }

      items.forEach((basketItem) => {
        const { price } = basketItem
        const { appliedReductions } = price?.total || []

        basketPayload.total_sale_reduction_with_tax += sumReductionsByCategory(
          appliedReductions,
          'sale',
        )
        basketPayload.total_campaign_reduction_with_tax +=
          sumReductionsByCategory(appliedReductions, 'campaign')

        basketPayload.total_with_tax += price?.total?.withTax ?? 0
        basketPayload.total_without_tax += price?.total?.withoutTax ?? 0
      })

      track('cart', basketPayload)
    },

    trackAddToBasket: ({
      product,
      quantity = 1,
      variant,
      index = 1,
      list,
    }: TrackAddToBasketParams) => {
      track('add_to_cart', {
        product: { ...product, index },
        variant,
        quantity,
        currencyCode,
        list,
      } as ProductActionData)
    },

    trackRemoveFromBasket: (
      product: Product,
      quantity: number,
      variant: Variant,
      index = 1,
    ) => {
      track('remove_from_cart', {
        product: { ...product, index },
        variant,
        quantity,
      })
    },

    trackBasket: (items: ProductListData[]) => {
      track('cart', { currencyCode, items })
    },

    trackViewBasket: (
      items: ProductListData[],
      pagePayload: BasicViewData,
      valueWithoutTax?: BasketTotalPrice,
    ) => {
      track('view_cart', {
        currencyCode,
        items,
        valueWithoutTax: divideWithHundred(valueWithoutTax?.withoutTax || 0),
        pagePayload,
      })
    },
  }
}
export default useBasketEvents
