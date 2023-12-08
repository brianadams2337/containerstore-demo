import {
  type BasketItem,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'

export default async (basketItem: Ref<BasketItem>) => {
  const promotionData = await useCurrentPromotions()

  const applicablePromotions = computed(() => {
    return promotionData.data.value.entities
  })

  const promotion = computed<BasketPromotion | undefined>(() => {
    return basketItem.value?.promotion
  })

  const giftPromotion = computed<Promotion>(() => {
    const id = getFirstAttributeValue(
      basketItem.value.product?.attributes,
      'promotion',
    )?.id
    return applicablePromotions.value.find((promotion) => {
      const isFreeGift = isBuyXGetYType(promotion)
      return isFreeGift && promotion.customData?.product?.promotionId === id
    })
  })

  const isBuyXGetY = computed(() => isBuyXGetYType(promotion.value))

  const isAutomaticDiscount = computed(() => {
    return isAutomaticDiscountType(promotion.value)
  })

  const backgroundColorStyle = computed(() => {
    const color =
      promotion.value?.customData.colorHex ||
      giftPromotion.value.customData.colorHex
    return getBackgroundColorStyle(color)
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
  }
}
