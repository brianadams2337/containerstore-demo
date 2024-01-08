import {
  type BasketItem,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'

export default async (basketItem: Ref<BasketItem>) => {
  const { allCurrentPromotions } = await useBasketPromotions()

  const promotion = computed<BasketPromotion | undefined>(() => {
    return basketItem.value?.promotion
  })

  const headlineParts = computed(() => {
    return promotion.value?.customData.headlineParts
  })

  const giftPromotion = computed<Promotion | undefined>(() => {
    const id = getFirstAttributeValue(
      basketItem.value.product?.attributes,
      'promotion',
    )?.id

    if (isBuyXGetY.value) {
      return promotion.value
    }

    return allCurrentPromotions.value.find((promotion) => {
      const isFreeGift = isBuyXGetYType(promotion)
      return isFreeGift && promotion?.customData?.product?.promotionId === id
    })
  })

  const giftConditions = computed(() => {
    return giftPromotion.value?.customData.giftConditions
  })

  const isBuyXGetY = computed(() => isBuyXGetYType(promotion.value))

  const isAutomaticDiscount = computed(() => {
    return isAutomaticDiscountType(promotion.value)
  })

  const backgroundColorStyle = computed(() => {
    const color = promotion.value?.customData?.colorHex
    return getBackgroundColorStyle(color)
  })

  const giftBackgroundColorStyle = computed(() => {
    return getBackgroundColorStyle(giftPromotion.value?.customData?.colorHex)
  })

  const hasFailedConditions = computed(() => {
    return !!promotion.value?.failedConditions?.length
  })

  const isFreeGift = computed(() => {
    const variantIds = getVariantIds(promotion.value)
    return (
      variantIds.includes(basketItem.value.variant.id) &&
      promotion.value?.isValid
    )
  })

  return {
    isBuyXGetY,
    isAutomaticDiscount,
    backgroundColorStyle,
    isFreeGift,
    promotion,
    hasFailedConditions,
    giftPromotion,
    headlineParts,
    giftConditions,
    giftBackgroundColorStyle,
  }
}
