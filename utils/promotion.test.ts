import { describe, expect, it } from 'vitest'
import { buyXgetYPromotionFactory } from '@scayle/storefront-nuxt/test/factories'
import {
  getBackgroundColorStyle,
  getTextColorStyle,
  getPromotionStyle,
} from './promotion'

describe('getBackgroundColorStyle', () => {
  it('should return background color style object with normalized color to hex', () => {
    const backgroundColor = getBackgroundColorStyle('red')
    expect(backgroundColor).toEqual({ backgroundColor: '#FF0000' })
  })

  it('should return fallback background color without alpha if color and alpha value is not provided', () => {
    const backgroundColor = getBackgroundColorStyle()
    expect(backgroundColor).toEqual({ backgroundColor: '#0038FF' })
  })
  it('should return fallback background color with alpha if color is not provided', () => {
    const backgroundColor = getBackgroundColorStyle(undefined, 50)
    expect(backgroundColor).toEqual({
      backgroundColor: 'rgba(0, 56, 255, 0.5)',
    })
  })

  it('should return background color style object with alpha value', () => {
    const backgroundColor = getBackgroundColorStyle('#ffffff', 5)
    expect(backgroundColor).toEqual({
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    expect(color).toEqual({ color: '#0038FF' })
  })
  it('should return fallback text color with alpha if color is not provided', () => {
    const backgroundColor = getBackgroundColorStyle(undefined, 50)
    expect(backgroundColor).toEqual({
      backgroundColor: 'rgba(0, 56, 255, 0.5)',
    })
  })

  it('should return text color style object with alpha value', () => {
    const color = getTextColorStyle('#ffffff', 5)
    expect(color).toEqual({
      color: 'rgba(255, 255, 255, 0.05)',
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
      customData: {
        color: {
          background: '#ffffff',
          text: '#EEEEEE',
        },
      },
    })
    const style = getPromotionStyle(promotion)

    expect(style).toEqual({
      backgroundColor: '#ffffff',
      color: '#EEEEEE',
    })
  })

  it('should return default if promotion is not provided', () => {
    expect(getPromotionStyle()).toStrictEqual({
      backgroundColor: '#0038FF',
      color: '#fff',
    })
  })
})
