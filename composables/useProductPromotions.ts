import {
  type Product,
  type Price,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'

export default async (productItem?: MaybeRefOrGetter<Product>) => {
  const promotionData = await useCurrentPromotions()
  const basket = await useBasket()

  const { appliedPromotions } = await useBasketPromotions()

  const product = toRef(productItem)

  const promotionLabel = computed(() => {
    return getFirstAttributeValue(product.value?.attributes, 'promotion')?.label
  })

  const productPromotionId = computed(() => {
    return getFirstAttributeValue(product.value?.attributes, 'promotion')?.id
  })

  const applicablePromotions = computed<Promotion[]>(() => {
    const promotions = promotionData.data.value.entities
    return promotions.filter(({ customData }) => {
      if (!productPromotionId.value || !customData.product?.promotionId) {
        return false
      }
      return customData.product?.promotionId === productPromotionId.value
    })
  })

  const buyXGetYPromotion = computed(() => {
    const items = applicablePromotions.value.filter(isBuyXGetYType)
    return useMin(items, ({ priority }) => priority)
  })

  const automaticDiscountPromotion = computed(() => {
    const items = applicablePromotions.value.filter(isAutomaticDiscountType)
    return useMin(items, ({ priority }) => priority)
  })

  const highestPriorityPromotion = computed(() => {
    return useMin(applicablePromotions.value, (promotion) => promotion.priority)
  })

  const isHighestPriorityPromotionApplied = computed(() => {
    return appliedPromotions.value.some((promotion) => {
      const isValid = promotion.isValid
      const isSamePromotionId =
        promotion.id === highestPriorityPromotion.value?.id

      if (isBuyXGetYType(promotion)) {
        return isSamePromotionId && isValid
      }

      const isSameProduct = promotion.productId === product.value?.id
      return isSamePromotionId && isSameProduct && isValid
    })
  })

  const hasMultipleApplicablePromotions = computed(() => {
    return applicablePromotions.value.length > 1
  })

  const hasBuyXGetY = computed(() => !!buyXGetYPromotion.value)

  const isBuyXGetYPrioritized = computed(() => {
    return isBuyXGetYType(highestPriorityPromotion.value)
  })

  const isProductAddedToBasket = computed(() => {
    return basket.items.value.some(
      (item) => item.product.id === product.value?.id,
    )
  })

  const isGiftAddedToBasket = computed(() => {
    if (!isBuyXGetYPrioritized.value) {
      return false
    }
    return basket.items.value.some(({ promotion, variant }) => {
      const variantIds = getVariantIds(buyXGetYPromotion.value)
      const hasVariantId = variantIds.includes(variant.id)
      return isBuyXGetYType(promotion) && hasVariantId
    })
  })

  const isHighestPriority = (priority: number): boolean => {
    return (
      hasMultipleApplicablePromotions.value &&
      highestPriorityPromotion.value?.priority === priority
    )
  }

  const areHurryToSaveBannersShown = computed(() => {
    return (
      (!isBuyXGetYPrioritized.value &&
        isHighestPriorityPromotionApplied.value) ||
      (isHighestPriorityPromotionApplied.value && isGiftAddedToBasket.value)
    )
  })

  const getAppliedAutomaticDiscountPrice = (
    price: Price,
  ): number | undefined => {
    const value = getAdditionalDataValue(automaticDiscountPromotion.value)
    if (!value) {
      return
    }
    const discount = divideWithHundred(price.withTax) * divideWithHundred(value)
    return price.withTax - discount
  }

  return {
    promotionLabel,
    productPromotionId,
    automaticDiscountPromotion,
    hasBuyXGetY,
    applicablePromotions,
    buyXGetYPromotion,
    getAppliedAutomaticDiscountPrice,
    isProductAddedToBasket,
    isGiftAddedToBasket,
    highestPriorityPromotion,
    hasMultipleApplicablePromotions,
    isBuyXGetYPrioritized,
    isHighestPriorityPromotionApplied,
    isHighestPriority,
    areHurryToSaveBannersShown,
  }
}
