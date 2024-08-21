import {
  type AutomaticDiscountEffect,
  type BasketResponseData,
  type BuyXGetYEffect,
  PromotionEffectType,
} from '@scayle/storefront-nuxt'
import { hexToRGBAColor } from '~/utils/color'
import { AlphaColorMap } from '~/constants'

type PromotionStyle =
  | { textColor: string; backgroundColor: string; color?: string }
  | { textColor?: string; backgroundColor: string; color: string }
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

export const getPromotionStyle = (
  promotion?: Promotion | null,
): PromotionStyle | undefined => {
  if (!promotion) {
    return
  }

  return {
    ...getBackgroundColorStyle(
      promotion.customData?.colorHex,
      AlphaColorMap.ALPHA_10,
    ),
    ...getTextColorStyle(
      promotion.customData?.colorHex,
      AlphaColorMap.ALPHA_100,
    ),
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
  if (!basket) {
    return 0
  }

  const promotionReductionsList = basket.cost.appliedReductions
    .filter(({ category }) => category === 'promotion')
    .map(({ amount }) => amount.absoluteWithTax)

  const promotionReductionsSum = promotionReductionsList.reduce(
    (acc, item) => acc + item,
    0,
  )

  return basket.cost.withTax + promotionReductionsSum
}
