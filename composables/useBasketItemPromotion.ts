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

  const minimumOrderValueForGift = computed(() => {
    return giftPromotion.value?.customData?.minOrderValue
  })

  const isMinOrderValueReached = computed(() => {
    if (!minimumOrderValueForGift.value) {
      return false
    }
    const basketTotal = getBasketTotalWithoutPromotions(basket.data.value.cost)
    return basketTotal >= minimumOrderValueForGift.value
  })

  const minOrderValueLeft = computed(() => {
    if (!minimumOrderValueForGift.value) {
      return 0
    }
    const basketTotal = getBasketTotalWithoutPromotions(basket.data.value.cost)
    const valueLeft = minimumOrderValueForGift.value - basketTotal
    return valueLeft >= 0 ? valueLeft : 0
  })

  const areGiftConditionsMet = computed(() => {
    const minQuantity = giftConditions.value?.minQuantity
    if (!minQuantity) {
      return false
    }

    const quantityCondition = basketItem.value?.quantity >= minQuantity

    if (!minimumOrderValueForGift.value) {
      return quantityCondition
    }

    return isMinOrderValueReached.value && quantityCondition
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
    minOrderValueLeft,
  }
}
