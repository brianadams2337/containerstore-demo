import { unique } from 'radash'

export async function useBasketPromotions() {
  const [{ items: basketItems }, promotionData] = await Promise.all([
    useBasket(),
    useCurrentPromotions(),
  ])

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

  return {
    appliedPromotions,
    buyXGetYPromotions,
    automaticDiscountPromotions,
    hasAppliedPromotions,
    allCurrentPromotions,
  }
}
