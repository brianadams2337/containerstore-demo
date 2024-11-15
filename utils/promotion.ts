import {
  type AutomaticDiscountEffect,
  type BuyXGetYEffect,
  PromotionEffectType,
} from '@scayle/storefront-nuxt'
import Color from 'color'
import { hexToRGBAColor } from '~/utils/color'
import { AlphaColorMap } from '~/constants'
import type { Promotion } from '~/types/promotion'

const FALLBACK_COLOR = '#007aff'

type PromotionStyle =
  | { textColor: string; backgroundColor: string; color?: string }
  | { textColor?: string; backgroundColor: string; color: string }

export const getBackgroundColorStyle = (
  color?: string | unknown,
  alpha?: number,
): { backgroundColor: string } => {
  if (typeof color !== 'string') {
    return {
      backgroundColor:
        alpha !== undefined
          ? hexToRGBAColor(FALLBACK_COLOR, alpha)
          : FALLBACK_COLOR,
    }
  }

  const backgroundColor = Color(color ?? FALLBACK_COLOR).hex()

  return {
    backgroundColor:
      alpha !== undefined
        ? hexToRGBAColor(backgroundColor, alpha)
        : backgroundColor,
  }
}
export const getTextColorStyle = (color?: unknown, alpha?: number) => {
  if (typeof color !== 'string') {
    return {
      color:
        alpha !== undefined
          ? hexToRGBAColor(FALLBACK_COLOR, alpha)
          : FALLBACK_COLOR,
    }
  }

  const textColor = Color(color ?? FALLBACK_COLOR).hex()
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

export const isBuyXGetYType = (promotion?: Promotion | null): boolean => {
  return promotion?.effect?.type === PromotionEffectType.BUY_X_GET_Y
}

export const isAutomaticDiscountType = (
  promotion?: Promotion | null,
): boolean => {
  return promotion?.effect?.type === PromotionEffectType.AUTOMATIC_DISCOUNT
}

export const getVariantIds = (promotion?: Promotion | null): number[] => {
  if (!isBuyXGetYType(promotion) || !promotion) {
    return []
  }
  const { additionalData } = promotion.effect as BuyXGetYEffect
  return additionalData.variantIds
}

export const getAdditionalData = (
  promotion?: Promotion | null,
): AutomaticDiscountEffect['additionalData'] | undefined => {
  if (!isAutomaticDiscountType(promotion) || !promotion) {
    return
  }
  const { additionalData } = promotion.effect as AutomaticDiscountEffect
  return additionalData
}
