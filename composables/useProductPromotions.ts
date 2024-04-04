import {
  type Product,
  type Price,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'

export async function useProductPromotions(
  productItem?: MaybeRefOrGetter<Product | undefined>,
) {
  const promotionData = await useCurrentPromotions()

  const basket = await useBasket()

  const { appliedPromotions } = await useBasketPromotions()

  const product = toRef(productItem)

  const promotions = computed<Promotion[]>(() => {
    return promotionData.data?.value?.entities ?? []
  })

  const promotionLabel = computed(() => {
    return getFirstAttributeValue(product.value?.attributes, 'promotion')?.label
  })

  const productPromotionId = computed(() => {
    return getFirstAttributeValue(product.value?.attributes, 'promotion')?.id
  })

  const applicablePromotions = computed<Promotion[]>(() => {
    const items = promotions.value.filter(({ customData }) => {
      if (!productPromotionId.value || !customData.product?.promotionId) {
        return false
      }
      return customData.product?.promotionId === productPromotionId.value
    })

    return _sort(items, (it) => it.priority)
  })

  const buyXGetYPromotion = computed(() => {
    const items = applicablePromotions.value.filter(isBuyXGetYType)
    return _min(items, ({ priority }) => priority)
  })

  const automaticDiscountPromotion = computed(() => {
    const items = applicablePromotions.value.filter(isAutomaticDiscountType)
    return _min(items, ({ priority }) => priority)
  })

  const highestPriorityPromotion = computed(() => {
    return _min(applicablePromotions.value, (promotion) => promotion.priority)
  })

  const addedProductBasketItem = computed(() => {
    return basket.items.value?.find(
      (item) => item.product.id === product.value?.id,
    )
  })

  const giftConditions = computed(() => {
    return buyXGetYPromotion.value?.customData?.giftConditions
  })

  const minimumOrderValueForGift = computed(() => {
    return buyXGetYPromotion.value?.customData?.minOrderValue
  })

  const isMinOrderValueReached = computed(() => {
    if (!minimumOrderValueForGift.value) {
      return false
    }
    const basketTotal = getBasketTotalWithoutPromotions(
      basket.data.value ?? undefined,
    )
    return basketTotal >= minimumOrderValueForGift.value
  })

  const minOrderValueLeft = computed(() => {
    if (!minimumOrderValueForGift.value) {
      return 0
    }
    const basketTotal = getBasketTotalWithoutPromotions(
      basket.data.value ?? undefined,
    )
    const valueLeft = minimumOrderValueForGift.value - basketTotal
    return valueLeft >= 0 ? valueLeft : 0
  })

  const areGiftConditionsMet = computed(() => {
    if (!isBuyXGetYPrioritized.value) {
      return false
    }

    const minPromotionQuantity = giftConditions.value?.minQuantity

    if (!minPromotionQuantity || !addedProductBasketItem.value) {
      return false
    }

    const quantityCondition =
      addedProductBasketItem.value?.quantity >= minPromotionQuantity

    if (!minimumOrderValueForGift.value) {
      return quantityCondition
    }

    return isMinOrderValueReached.value && quantityCondition
  })

  const quantityLeftForGiftConditions = computed(() => {
    if (!giftConditions.value?.minQuantity || !addedProductBasketItem.value) {
      return
    }
    return (
      giftConditions.value.minQuantity - addedProductBasketItem.value.quantity
    )
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

  const isProductAddedToBasket = computed(() => !!addedProductBasketItem.value)

  const isGiftAddedToBasket = computed(() => {
    if (!isBuyXGetYPrioritized.value) {
      return false
    }
    return basket.items.value?.some(({ promotion, variant }) => {
      const variantIds = getVariantIds(buyXGetYPromotion.value)
      const hasVariantId = variantIds.includes(variant.id)
      return (
        isBuyXGetYType(promotion) &&
        hasVariantId &&
        buyXGetYPromotion.value?.id === promotion?.id
      )
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
    const discount = divideByHundred(price.withTax) * divideByHundred(value)
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
    areGiftConditionsMet,
    giftConditions,
    addedProductBasketItem,
    quantityLeftForGiftConditions,
    minOrderValueLeft,
  }
}
