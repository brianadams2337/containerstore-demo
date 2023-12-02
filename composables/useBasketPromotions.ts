export default async () => {
  const basket = await useBasket()

  const appliedPromotions = computed(() => {
    return basket.items.value
      .filter(({ promotion, variant }) => {
        const variantIds = getVariantIds(promotion)
        const isFreeGift = variantIds.includes(variant.id)
        return !isFreeGift && !promotion?.failedConditions.length
      })
      .map(({ promotion, product }) => ({
        ...promotion,
        productId: product.id,
      })) as (Promotion & { productId: number })[]
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
