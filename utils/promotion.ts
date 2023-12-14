import {
  PromotionEffectType,
  type BuyXGetYEffect,
  type AutomaticDiscountEffect,
} from '@scayle/storefront-nuxt'

export const getBackgroundColorStyle = (color?: string) => {
  const fallbackColor = '#007aff'
  return { backgroundColor: color || fallbackColor }
}

export const isBuyXGetYType = (promotion?: Promotion | null) => {
  return promotion?.effect?.type === PromotionEffectType.BUY_X_GET_Y
}

export const isAutomaticDiscountType = (promotion?: Promotion | null) => {
  return promotion?.effect?.type === PromotionEffectType.AUTOMATIC_DISCOUNT
}

export const getVariantIds = (promotion?: Promotion | null): number[] => {
  if (!isBuyXGetYType(promotion) || !promotion) {
    return []
  }
  const { additionalData } = promotion.effect as BuyXGetYEffect
  return additionalData.variantIds
}

export const getAdditionalDataValue = (
  promotion?: Promotion | null,
): number | undefined => {
  if (!isAutomaticDiscountType(promotion) || !promotion) {
    return
  }
  const { additionalData } = promotion.effect as AutomaticDiscountEffect
  return additionalData.value
}
