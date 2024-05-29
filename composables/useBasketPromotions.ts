import { extendPromise } from '@scayle/storefront-nuxt'
import { unique } from 'radash'

export function useBasketPromotions() {
  const basket = useBasket()
  const promotionData = useCurrentPromotions()

  const { items: basketItems } = basket

  const allCurrentPromotions = computed<Promotion[]>(() => {
    return promotionData.data?.value?.entities ?? []
  })

  const appliedPromotions = computed(() => {
    if (!basketItems.value) {
      return []
    }
    return basketItems.value
      .filter(({ promotion }) => promotion?.isValid)
      .map(({ promotion, product }) => ({
        ...promotion,
        productId: product.id,
      })) as (BasketPromotion & { productId: number })[]
  })

  const buyXGetYPromotions = computed(() => {
    return unique(
      appliedPromotions.value.filter(isBuyXGetYType),
      ({ id }) => id,
    )
  })

  const automaticDiscountPromotions = computed(() => {
    return unique(
      appliedPromotions.value.filter(isAutomaticDiscountType),
      ({ id }) => id,
    )
  })

  const hasAppliedPromotions = computed(() => !!appliedPromotions.value.length)

  return extendPromise(
    Promise.all([basket, promotionData]).then(() => ({})),
    {
      appliedPromotions,
      buyXGetYPromotions,
      automaticDiscountPromotions,
      hasAppliedPromotions,
      allCurrentPromotions,
    },
  )
}
