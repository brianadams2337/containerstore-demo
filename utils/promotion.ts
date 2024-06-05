import { sum } from 'radash'
import {
  PromotionEffectType,
  type BuyXGetYEffect,
  type AutomaticDiscountEffect,
  type BasketResponseData,
} from '@scayle/storefront-nuxt'
import { hexToRGBAColor } from '~/utils/color'

export const getBackgroundColorStyle = (
  color?: string | unknown,
  alpha?: number,
): { backgroundColor: string } => {
  const fallbackColor = '#007aff'
  if (typeof color !== 'string') return { backgroundColor: fallbackColor }

  const backgroundColor = color ?? fallbackColor

  return {
    backgroundColor:
      alpha !== undefined
        ? hexToRGBAColor(backgroundColor, alpha)
        : backgroundColor,
  }
}
export const getTextColorStyle = (color?: unknown, alpha?: number) => {
  const fallbackColor = '#007aff'
  if (typeof color !== 'string') return { textColor: fallbackColor }

  const textColor = color ?? fallbackColor
  return {
    color: alpha !== undefined ? hexToRGBAColor(textColor, alpha) : textColor,
  }
}

export const isBuyXGetYType = (promotion?: Promotion | null) => {
  return promotion?.effect?.type === PromotionEffectType.BUY_X_GET_Y
}

export const isAutomaticDiscountType = (promotion?: Promotion | null) => {
  return promotion?.effect?.type === PromotionEffectType.AUTOMATIC_DISCOUNT
}

export const getVariantIds = (promotion?: Promotion | null): number[] => {
  if (!isBuyXGetYType(promotion) || !promotion) return []
  const { additionalData } = promotion.effect as BuyXGetYEffect
  return additionalData.variantIds
}

export const getAdditionalData = (
  promotion?: Promotion | null,
): AutomaticDiscountEffect['additionalData'] | undefined => {
  if (!isAutomaticDiscountType(promotion) || !promotion) return
  const { additionalData } = promotion.effect as AutomaticDiscountEffect
  return additionalData
}

export const getBasketTotalWithoutPromotions = (
  basket?: BasketResponseData,
) => {
  if (!basket) return 0
  const promotionReductions = sum(
    basket.cost.appliedReductions
      .filter(({ category }) => category === 'promotion')
      .map(({ amount }) => amount.absoluteWithTax),
  )

  return basket.cost.withTax + promotionReductions
}
