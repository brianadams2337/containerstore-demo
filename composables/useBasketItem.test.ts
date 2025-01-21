import { describe, it, expect } from 'vitest'
import { toRef } from 'vue'
import { PromotionEffectType } from '@scayle/storefront-api'
import type { CentAmount } from '@scayle/storefront-core'
import { useBasketItem } from './useBasketItem'
import {
  basketItemFactory,
  basketItemPriceFactory,
} from '~/test/factories/basket'
import { promotionFactory } from '~/test/factories/promotion'
import { variantFactory } from '~/test/factories/variant'

describe('useBasketItem', () => {
  describe('isSoldOut', () => {
    it('should return "true" if basket item is sold out ', () => {
      const basketItem = basketItemFactory.build({ status: 'unavailable' })
      const { isSoldOut } = useBasketItem(toRef(basketItem))
      expect(isSoldOut.value).toEqual(true)
    })

    it('should return "false" if basket item is available', () => {
      const basketItem = basketItemFactory.build({ status: 'available' })
      const { isSoldOut } = useBasketItem(toRef(basketItem))
      expect(isSoldOut.value).toEqual(false)
    })
  })

  describe('isFreeGift', () => {
    it('should return "true" if basket item is free gift ', () => {
      const promotion = promotionFactory.build({
        effect: {
          type: PromotionEffectType.BuyXGetY,
          additionalData: {
            variantIds: [1, 2],
            maxCount: 1,
          },
        },
        isValid: true,
      })

      const basketItem = basketItemFactory.build({
        promotion,
        variant: variantFactory.build({ id: 1 }),
      })
      const { isFreeGift } = useBasketItem(toRef(basketItem))
      expect(isFreeGift.value).toEqual(true)
    })

    it('should return "false" if basket item is not a free gift ', () => {
      const promotion = promotionFactory.build({
        effect: {
          type: PromotionEffectType.BuyXGetY,
          additionalData: {
            variantIds: [1, 2],
            maxCount: 1,
          },
        },
      })

      const basketItem = basketItemFactory.build({
        variant: variantFactory.build({ id: 3 }),
        promotion,
      })
      const { isFreeGift } = useBasketItem(toRef(basketItem))
      expect(isFreeGift.value).toEqual(false)
    })
  })

  describe('price', () => {
    it('should return basket total price item is not free gift', () => {
      const promotion = promotionFactory.build({
        effect: {
          type: PromotionEffectType.BuyXGetY,
          additionalData: {
            variantIds: [1, 2],
            maxCount: 1,
          },
        },
        isValid: true,
      })

      const priceTotal = basketItemPriceFactory.build({
        currencyCode: 'EUR',
        withTax: 3592,
        withoutTax: 1796,
        appliedReductions: [],
      })

      const basketItem = basketItemFactory.build({
        promotion,
        price: {
          total: priceTotal,
          unit: priceTotal,
        },
        variant: variantFactory.build({ id: 3 }),
      })

      const { price } = useBasketItem(toRef(basketItem))

      expect(price.value).toEqual({
        currencyCode: 'EUR',
        withoutTax: 1796,
        withTax: 3592,
        appliedReductions: [],
      })
    })

    it('should return custom price if item is free gift', () => {
      const promotion = promotionFactory.build({
        effect: {
          type: PromotionEffectType.BuyXGetY,
          additionalData: {
            variantIds: [1, 2],
            maxCount: 1,
          },
        },
        isValid: true,
      })

      const priceTotal = basketItemPriceFactory.build({
        currencyCode: 'EUR',
        withTax: 3592,
        withoutTax: 1796,
        appliedReductions: [
          {
            category: 'promotion',
            type: 'relative',
            amount: {
              relative: 0.2,
              absoluteWithTax: 898 as CentAmount,
            },
          },
        ],
      })

      const basketItem = basketItemFactory.build({
        promotion,
        price: {
          total: priceTotal,
          unit: priceTotal,
        },

        variant: variantFactory.build({ id: 1 }),
      })

      const { price } = useBasketItem(toRef(basketItem))

      expect(price.value).toEqual({
        currencyCode: 'EUR',
        withoutTax: 1796,
        withTax: 0,
        appliedReductions: [
          {
            category: 'promotion',
            type: 'relative',
            amount: {
              relative: 1,
              absoluteWithTax: 898 as CentAmount,
            },
          },
        ],
      })
    })
  })
})
