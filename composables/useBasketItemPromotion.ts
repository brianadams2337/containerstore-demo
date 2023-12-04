import type { BasketItem } from '@scayle/storefront-nuxt'

export default (basketItem: Ref<BasketItem>) => {
  const promotion = computed<BasketPromotion | undefined>(() => {
    return basketItem.value?.promotion
  })

  const isBuyXGetY = computed(() => isBuyXGetYType(promotion.value))

  const isAutomaticDiscount = computed(() => {
    return isAutomaticDiscountType(promotion.value)
  })

  const backgroundColorStyle = computed(() => {
    return getBackgroundColorStyle(promotion.value?.customData?.colorHex)
  })

  const hasFailedConditions = computed(() => {
    return !!promotion.value?.failedConditions?.length
  })

  const isFreeGift = computed(() => {
    const variantIds = getVariantIds(promotion.value)
    const hasVariantId = variantIds.includes(basketItem.value.variant.id)
    return !hasFailedConditions.value && hasVariantId
  })

  return {
    isBuyXGetY,
    isAutomaticDiscount,
    backgroundColorStyle,
    isFreeGift,
    promotion,
    hasFailedConditions,
  }
}
