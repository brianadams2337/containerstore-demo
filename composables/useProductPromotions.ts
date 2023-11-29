import {
  type Product,
  type Price,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'

export default async (productItem?: MaybeRefOrGetter<Product>) => {
  const promotionData = await useCurrentPromotions()
  const basket = await useBasket()

  const product = toRef(productItem)

  const promotionLabel = computed(() => {
    return getFirstAttributeValue(product.value?.attributes, 'promotion')?.label
  })

  const productPromotionId = computed(() => {
    return getFirstAttributeValue(product.value?.attributes, 'promotion')?.id
  })

  const applicablePromotions = computed<Promotion[]>(() => {
    const promotions = promotionData.data.value.entities
    return promotions.filter((it) => {
      if (!productPromotionId.value || !it.customData.product?.promotionId) {
        return false
      }
      return it.customData.product?.promotionId === productPromotionId.value
    })
  })

  const buyXGetYPromotion = computed(() => {
    const items = applicablePromotions.value.filter((it) => isBuyXGetYType(it))
    return useMin(items, (it) => it.priority)
  })

  const automaticDiscountPromotion = computed(() => {
    const items = applicablePromotions.value.filter((it) => {
      return isAutomaticDiscountType(it)
    })
    return useMin(items, (it) => it.priority)
  })

  const highestPriorityPromotion = computed(() => {
    return useMin(applicablePromotions.value, (it) => it.priority)
  })

  const hasMultipleApplicablePromotions = computed(() => {
    return applicablePromotions.value.length > 1
  })

  const hasBuyXGetY = computed(() => !!buyXGetYPromotion.value)

  const isBuyXGetYPrioritized = computed(() => {
    return isBuyXGetYType(highestPriorityPromotion.value)
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

  const isProductAddedToBasket = computed(() => {
    return basket.items.value.some((it) => it.product.id === product.value?.id)
  })

  const isGiftAddedToBasket = computed(() => {
    return basket.items.value.some((it) => {
      const variantIds = getVariantIds(buyXGetYPromotion.value)
      const hasVariantId = variantIds.includes(it.variant.id)
      return isBuyXGetYType(it.promotion) && hasVariantId
    })
  })

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
  }
}
