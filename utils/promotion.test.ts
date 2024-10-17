import { describe, expect, it } from 'vitest'
import { PromotionEffectType } from '@scayle/storefront-api'
import {
  getBackgroundColorStyle,
  getTextColorStyle,
  getPromotionStyle,
  isBuyXGetYType,
  isAutomaticDiscountType,
  getVariantIds,
  getAdditionalData,
} from './promotion'
import { promotionFactory } from '~/test/factories/promotion'

describe('getBackgroundColorStyle', () => {
  it('should return background color style object with normalized color to hex', () => {
    const backgroundColor = getBackgroundColorStyle('red')
    expect(backgroundColor).toEqual({ backgroundColor: '#FF0000' })
  })

  it('should return fallback background color if color is not provided', () => {
    const backgroundColor = getBackgroundColorStyle()
    expect(backgroundColor).toEqual({ backgroundColor: '#007aff' })
  })

  it('should return background color style object with alpha value', () => {
    const backgroundColor = getBackgroundColorStyle('#ffffff', 5)
    expect(backgroundColor).toEqual({
      backgroundColor: 'rgba(255,255,255,0.05)',
    })
  })
})

describe('getTextColorStyle', () => {
  it('should return text color style object with normalized color to hex', () => {
    const color = getTextColorStyle('red')
    expect(color).toEqual({ color: '#FF0000' })
  })

  it('should return fallback text color if color is not provided', () => {
    const color = getTextColorStyle()
    expect(color).toEqual({ color: '#007aff' })
  })

  it('should return text color style object with alpha value', () => {
    const color = getTextColorStyle('#ffffff', 5)
    expect(color).toEqual({
      color: 'rgba(255,255,255,0.05)',
    })
  })
})

describe('getPromotionStyle', () => {
  it('should return promotion style object', () => {
    const promotion = promotionFactory.build({
      effect: {
        type: PromotionEffectType.BuyXGetY,
        additionalData: {
          variantIds: [12389244, 23985437],
          maxCount: 1,
        },
      },
      customData: { colorHex: '#ffffff' },
    })
    const style = getPromotionStyle(promotion)

    expect(style).toEqual({
      backgroundColor: 'rgba(255,255,255,0.1)',
      color: 'rgba(255,255,255,1)',
    })
  })

  it('should return undefined if promotion is not provided', () => {
    expect(getPromotionStyle()).toBeUndefined()
  })
})

describe('isBuyXGetYType', () => {
  it('should return "true" if it is "buy_x_get_y" type', () => {
    const promotion = promotionFactory.build({
      effect: {
        type: PromotionEffectType.BuyXGetY,
        additionalData: {
          variantIds: [12389244, 23985437],
          maxCount: 1,
        },
      },
    })
    expect(isBuyXGetYType(promotion)).toEqual(true)
  })

  it('should return "false" if it is not "buy_x_get_y" type', () => {
    const promotion = promotionFactory.build({
      effect: {
        type: PromotionEffectType.AutomaticDiscount,
        additionalData: {
          type: 'relative',
          value: 1000,
        },
      },
    })
    expect(isBuyXGetYType(promotion)).toEqual(false)
  })

  it('should return "false" if promotion is not provided', () => {
    expect(isBuyXGetYType()).toEqual(false)
  })
})

describe('isAutomaticDiscountType', () => {
  it('should return "true" if it is "automatic_discount" type', () => {
    const promotion = promotionFactory.build({
      effect: {
        type: PromotionEffectType.AutomaticDiscount,
        additionalData: {
          type: 'relative',
          value: 1000,
        },
      },
    })
    expect(isAutomaticDiscountType(promotion)).toEqual(true)
  })

  it('should return "false" if it is not "automatic_discount" type', () => {
    const promotion = promotionFactory.build({
      effect: {
        type: PromotionEffectType.BuyXGetY,
        additionalData: {
          variantIds: [12389244, 23985437],
          maxCount: 1,
        },
      },
    })
    expect(isAutomaticDiscountType(promotion)).toEqual(false)
  })

  it('should return "false" if promotion is not provided', () => {
    expect(isAutomaticDiscountType()).toEqual(false)
  })
})

describe('getVariantIds', () => {
  it('should return an empty array if promotion is not provided or it is not "buy_x_get_y" type', () => {
    const promotion = promotionFactory.build({
      effect: {
        type: PromotionEffectType.AutomaticDiscount,
        additionalData: {
          type: 'relative',
          value: 1000,
        },
      },
    })

    expect(getVariantIds()).toEqual([])
    expect(getVariantIds(promotion)).toEqual([])
  })

  it('should return variant ids for "buy_x_get_y" promotion', () => {
    const promotion = promotionFactory.build({
      effect: {
        type: PromotionEffectType.BuyXGetY,
        additionalData: {
          variantIds: [12389244, 23985437],
          maxCount: 1,
        },
      },
    })

    expect(getVariantIds(promotion)).toEqual([12389244, 23985437])
  })
})

describe('getAdditionalData', () => {
  it('should return undefined if promotion is not provided or it is not "automatic_discount" type', () => {
    const promotion = promotionFactory.build({
      effect: {
        type: PromotionEffectType.BuyXGetY,
        additionalData: {
          variantIds: [12389244, 23985437],
          maxCount: 1,
        },
      },
    })

    expect(getAdditionalData()).toBeUndefined()
    expect(getAdditionalData(promotion)).toBeUndefined()
  })

  it('should return additional data for "automatic_discount" promotion', () => {
    const promotion = promotionFactory.build({
      effect: {
        type: PromotionEffectType.AutomaticDiscount,
        additionalData: {
          type: 'relative',
          value: 1000,
        },
      },
    })

    expect(getAdditionalData(promotion)).toEqual({
      type: 'relative',
      value: 1000,
    })
  })
})
