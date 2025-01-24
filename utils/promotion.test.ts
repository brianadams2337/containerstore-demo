import { describe, expect, it } from 'vitest'
import {
  basketItemFactory,
  automaticDiscountPromotionFactory,
  buyXgetYPromotionFactory,
} from '@scayle/storefront-nuxt/test/factories'
import {
  getBackgroundColorStyle,
  getTextColorStyle,
  getPromotionStyle,
  isBuyXGetYType,
  isAutomaticDiscountType,
  getVariantIds,
  getAdditionalData,
  isFreeGiftEligible,
  isFreeGiftBasketItem,
} from './promotion'

describe('getBackgroundColorStyle', () => {
  it('should return background color style object with normalized color to hex', () => {
    const backgroundColor = getBackgroundColorStyle('red')
    expect(backgroundColor).toEqual({ backgroundColor: '#FF0000' })
  })

  it('should return fallback background color without alpha if color and alpha value is not provided', () => {
    const backgroundColor = getBackgroundColorStyle()
    expect(backgroundColor).toEqual({ backgroundColor: '#007aff' })
  })
  it('should return fallback background color with alpha if color is not provided', () => {
    const backgroundColor = getBackgroundColorStyle(undefined, 50)
    expect(backgroundColor).toEqual({ backgroundColor: 'rgba(0,122,255,0.5)' })
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
  it('should return fallback text color with alpha if color is not provided', () => {
    const backgroundColor = getBackgroundColorStyle(undefined, 50)
    expect(backgroundColor).toEqual({ backgroundColor: 'rgba(0,122,255,0.5)' })
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
    const promotion = buyXgetYPromotionFactory.build({
      effect: {
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
    const promotion = buyXgetYPromotionFactory.build({
      effect: {
        additionalData: {
          variantIds: [12389244, 23985437],
          maxCount: 1,
        },
      },
    })
    expect(isBuyXGetYType(promotion)).toEqual(true)
  })

  it('should return "false" if it is not "buy_x_get_y" type', () => {
    const promotion = automaticDiscountPromotionFactory.build({
      effect: {
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
    const promotion = automaticDiscountPromotionFactory.build({
      effect: {
        additionalData: {
          type: 'relative',
          value: 1000,
        },
      },
    })
    expect(isAutomaticDiscountType(promotion)).toEqual(true)
  })

  it('should return "false" if it is not "automatic_discount" type', () => {
    const promotion = buyXgetYPromotionFactory.build({
      effect: {
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
    const promotion = automaticDiscountPromotionFactory.build({
      effect: {
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
    const promotion = buyXgetYPromotionFactory.build({
      effect: {
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
    const promotion = buyXgetYPromotionFactory.build({
      effect: {
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
    const promotion = automaticDiscountPromotionFactory.build({
      effect: {
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

describe('isFreeGiftEligible', () => {
  it('should be a free gift', () => {
    const basketItem = basketItemFactory.build({
      promotion: buyXgetYPromotionFactory.build({
        effect: {
          additionalData: {
            variantIds: [10],
          },
        },
      }),
      variant: {
        id: 10,
      },
    })

    expect(isFreeGiftEligible(basketItem)).toBe(true)
  })
  it('should not be a free gift', () => {
    const basketItem = basketItemFactory.build({
      promotion: buyXgetYPromotionFactory.build({
        effect: {
          additionalData: {
            variantIds: [10],
          },
        },
      }),
      variant: {
        id: 101,
      },
    })

    expect(isFreeGiftEligible(basketItem)).toBe(false)
  })
})
describe('isFreeGiftBasketItem', () => {
  it('return true when item is eligible and  promotion condition is valid', () => {
    const basketItem = basketItemFactory.build({
      promotion: buyXgetYPromotionFactory.build({
        effect: {
          additionalData: {
            variantIds: [10],
          },
        },
        isValid: true,
      }),
      variant: {
        id: 10,
      },
    })

    expect(isFreeGiftBasketItem(basketItem)).toBe(true)
  })
  it('return false when item is eligible and promotion condition is not value', () => {
    const basketItem = basketItemFactory.build({
      promotion: buyXgetYPromotionFactory.build({
        effect: {
          additionalData: {
            variantIds: [10],
          },
        },
        isValid: false,
      }),
      variant: {
        id: 101,
      },
    })

    expect(isFreeGiftBasketItem(basketItem)).toBe(false)
  })

  it('return false for normal basket', () => {
    const basketItem = basketItemFactory.build({
      promotion: undefined,
    })

    expect(isFreeGiftBasketItem(basketItem)).toBe(false)
  })
})
