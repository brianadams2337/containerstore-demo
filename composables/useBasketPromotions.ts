export default async () => {
  const basket = await useBasket()
  const promotionData = await useCurrentPromotions()

  const allCurrentPromotions = computed<Promotion[]>(() => {
    return promotionData.data.value.entities
  })

  const appliedPromotions = computed(() => {
    return basket.items.value
      .filter(({ promotion }) => promotion?.isValid)
      .map(({ promotion, product }) => ({
        ...promotion,
        productId: product.id,
      })) as (BasketPromotion & { productId: number })[]
  })

  const buyXGetYPromotions = computed(() => {
    return useUnique(
      appliedPromotions.value.filter(isBuyXGetYType),
      ({ id }) => id,
    )
  })

  const automaticDiscountPromotions = computed(() => {
    return useUnique(
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
