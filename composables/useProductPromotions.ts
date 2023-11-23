import {
  type Product,
  type BuyXGetYEffect,
  type AutomaticDiscountEffect,
  type Price,
  getFirstAttributeValue,
  PromotionEffectType,
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
    return applicablePromotions.value.find((it) => {
      return it.effect.type === PromotionEffectType.BUY_X_GET_Y
    })
  })

  const automaticDiscountPromotion = computed(() => {
    return applicablePromotions.value.find((it) => {
      return it.effect.type === PromotionEffectType.AUTOMATIC_DISCOUNT
    })
  })

  const highestPriorityPromotion = computed(() => {
    return useMin(applicablePromotions.value, (it) => it.priority)
  })

  const hasMultipleApplicablePromotions = computed(() => {
    return applicablePromotions.value.length > 1
  })

  const hasBuyXGetY = computed(() => !!buyXGetYPromotion.value)

  const hasMultipleFreeGifts = computed(() => {
    if (!hasBuyXGetY.value) {
      return false
    }
    const effect = buyXGetYPromotion.value?.effect as BuyXGetYEffect
    return effect.additionalData.variantIds.length > 1
  })

  const getAppliedAutomaticDiscountPrice = (price: Price) => {
    if (!automaticDiscountPromotion.value) {
      return
    }
    const { additionalData } = automaticDiscountPromotion.value
      ?.effect as AutomaticDiscountEffect
    const discount = divideWithHundred(price.withTax * additionalData.value)
    return price.withTax - discount
  }

  const isProductAddedToBasket = computed(() => {
    return basket.items.value.some((it) => it.product.id === product.value?.id)
  })

  const isGiftAddedToBasket = computed(() => {
    return basket.items.value.some((it) => {
      const effect = buyXGetYPromotion.value?.effect as BuyXGetYEffect
      const { variantIds } = effect.additionalData
      return variantIds.includes(it.variant.id)
    })
  })

  return {
    promotionLabel,
    productPromotionId,
    automaticDiscountPromotion,
    hasBuyXGetY,
    hasMultipleFreeGifts,
    applicablePromotions,
    buyXGetYPromotion,
    getAppliedAutomaticDiscountPrice,
    isProductAddedToBasket,
    isGiftAddedToBasket,
    highestPriorityPromotion,
    hasMultipleApplicablePromotions,
  }
}
