export default async () => {
  const basket = await useBasket()

  const appliedPromotions = computed(() => {
    return basket.items.value
      .filter(({ promotion, variant }) => {
        const variantIds = getVariantIds(promotion)
        return !variantIds.includes(variant.id)
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
