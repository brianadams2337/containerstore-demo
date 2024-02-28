import {
  type BasketItem,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'

export async function useBasketItemPromotion(basketItem: Ref<BasketItem>) {
  const basket = await useBasket()
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
    return giftPromotion.value?.customData?.giftConditions
  })

  const giftMov = computed(() => {
    return giftPromotion.value?.customData?.minOrderValue
  })

  const isMovReached = computed(() => {
    if (!giftMov.value) {
      return false
    }
    const basketTotal = getBasketTotalWithoutPromotions(basket.data.value.cost)
    return basketTotal >= giftMov.value
  })

  const movLeft = computed(() => {
    if (!giftMov.value) {
      return 0
    }
    const basketTotal = getBasketTotalWithoutPromotions(basket.data.value.cost)
    const valueLeft = giftMov.value - basketTotal
    return valueLeft >= 0 ? valueLeft : 0
  })

  const areGiftConditionsMet = computed(() => {
    const minQuantity = giftConditions.value?.minQuantity
    if (!minQuantity) {
      return false
    }

    const quantityCondition = basketItem.value?.quantity >= minQuantity

    if (!giftMov.value) {
      return quantityCondition
    }

    return isMovReached.value && quantityCondition
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

  const quantityLeftForGiftConditions = computed(() => {
    if (!giftConditions.value?.minQuantity) {
      return
    }
    return giftConditions.value.minQuantity - basketItem.value.quantity
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
    areGiftConditionsMet,
    quantityLeftForGiftConditions,
    movLeft,
  }
}
