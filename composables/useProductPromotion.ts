import {
  type Product,
  type BuyXGetYEffect,
  PromotionEffectType,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'

export default async (productItem: MaybeRefOrGetter<Product>) => {
  const promotionData = await useCurrentPromotions()

  const product = toRef(productItem)

  const promotionLabel = computed(() => {
    return getFirstAttributeValue(product.value.attributes, 'promotion')?.label
  })

  const productPromotionId = computed(() => {
    return getFirstAttributeValue(product.value.attributes, 'promotion')?.id
  })

  const applicablePromotion = computed<Promotion>(() => {
    const promotions = promotionData.data.value.entities
    return promotions.find((it) => {
      return it.customData.productPromotionId === productPromotionId.value
    })
  })

  const backgroundColorStyle = computed(() => {
    const color = applicablePromotion.value.customData.colorHex
    return getBackgroundColorStyle(color)
  })

  const isAutomaticDiscount = computed(() => {
    const effectType = applicablePromotion.value?.effect.type
    return effectType === PromotionEffectType.AUTOMATIC_DISCOUNT
  })

  const isBuyXGetY = computed(() => {
    const effectType = applicablePromotion.value?.effect.type
    return effectType === PromotionEffectType.BUY_X_GET_Y
  })

  const hasMultipleFreeGifts = computed(() => {
    if (!isBuyXGetY.value) {
      return false
    }
    const effect = applicablePromotion.value?.effect as BuyXGetYEffect
    return effect.additionalData.variantIds.length > 1
  })

  return {
    promotionLabel,
    productPromotionId,
    applicablePromotion,
    backgroundColorStyle,
    isAutomaticDiscount,
    isBuyXGetY,
    hasMultipleFreeGifts,
  }
}
