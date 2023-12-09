export default async () => {
  const basket = await useBasket()

  const appliedPromotions = computed(() => {
    return basket.items.value
      .filter(({ promotion }) => promotion?.isValid)
      .map(({ promotion, product }) => ({
        ...promotion,
        productId: product.id,
      })) as (BasketPromotion & { productId: number })[]
  })

  const buyXGetYPromotions = computed(() => {
    return appliedPromotions.value.filter(isBuyXGetYType)
  })

  const automaticDiscountPromotions = computed(() => {
    return appliedPromotions.value.filter(isAutomaticDiscountType)
  })

  const hasAppliedPromotions = computed(() => !!appliedPromotions.value.length)

  return {
    appliedPromotions,
    buyXGetYPromotions,
    automaticDiscountPromotions,
    hasAppliedPromotions,
  }
}
