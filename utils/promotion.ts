import type { Promotion } from '@scayle/storefront-nuxt'
import Color from 'color'

const getRGBAValue = (color: string, alpha: AlphaValue) =>
  Color(color)
    .alpha(alpha / 100)
    .rgb()
    .string()

export const FALLBACK_COLOR = '#0038FF'

export const FALLBACK_PROMOTION_COLORS = {
  background: FALLBACK_COLOR,
  text: '#fff',
}

type AlphaValue = 0 | 5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100

export type PromotionStyle =
  | {
      textColor: string
      backgroundColor: string
      color?: string
    }
  | {
      textColor?: string
      backgroundColor: string
      color: string
    }

/**
 * Returns a style object with a background color based on the provided color and alpha values.
 *
 * @param color - The color to use for the background. If not provided, the fallback color will be used.
 * @param alpha - The alpha value to apply to the color. If not provided, no alpha will be applied.
 *
 * @returns An object containing the background color style as hex color.
 */
export const getBackgroundColorStyle = (
  color?: string | unknown,
  alpha?: AlphaValue,
): { backgroundColor: string } => {
  const colorHex = Color(color ?? FALLBACK_COLOR).hex()

  return {
    backgroundColor:
      alpha !== undefined ? getRGBAValue(colorHex, alpha) : colorHex,
  }
}
/**
 * Returns a style object with a text color based on the provided color and alpha values.
 *
 * @param color - The color to use for the text. If not provided, the fallback color will be used.
 * @param alpha - The alpha value to apply to the color. If not provided, no alpha will be applied.
 *
 * @returns An object containing the text color style as hex color.
 */
export const getTextColorStyle = (
  color?: string | unknown,
  alpha?: AlphaValue,
) => {
  const colorHex = Color(color ?? FALLBACK_COLOR).hex()
  return {
    color: alpha !== undefined ? getRGBAValue(colorHex, alpha) : colorHex,
  }
}

/**
 * Returns a promotion style object based on the provided promotion.
 *
 * @param promotion - The promotion to use for determining the style. If not provided, an empty style will be returned.
 *
 * @returns An object containing the promotion style as hex color.
 */
export const getPromotionStyle = (
  promotion?: Promotion | null,
): PromotionStyle => {
  if (!promotion) {
    return {
      backgroundColor: FALLBACK_PROMOTION_COLORS.background,
      color: FALLBACK_PROMOTION_COLORS.text,
    }
  }

  return {
    backgroundColor:
      promotion.customData?.color?.background ||
      FALLBACK_PROMOTION_COLORS.background,
    color: promotion.customData?.color?.text || FALLBACK_PROMOTION_COLORS.text,
  }
}
