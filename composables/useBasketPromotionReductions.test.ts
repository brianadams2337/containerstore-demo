import { describe, it, expect } from 'vitest'
import type { CentAmount } from '@scayle/storefront-nuxt'
import { PromotionEffectType } from '@scayle/storefront-api'
import { toRef } from 'vue'
import { useBasketPromotionReductions } from './useBasketPromotionReductions'
import {
  costFactory,
  basketItemsFactory,
  basketItemFactory,
} from '~/test/factories/basket'
import { priceFactory } from '~/test/factories/price'
import { promotionFactory } from '~/test/factories/promotion'

describe('useBasketPromotionReductions', () => {
  describe('totalPromotionReductions', () => {
    it('should return total sum of promotion reductions', () => {
      const cost = costFactory.build({
        withTax: 1000,
        appliedReductions: [
          {
            category: 'campaign',
            type: 'relative',
            amount: {
              relative: 0.3,
              absoluteWithTax: 4000 as CentAmount,
            },
          },
          {
            category: 'promotion',
            type: 'relative',
            amount: {
              relative: 0.2,
              absoluteWithTax: 1000 as CentAmount,
            },
          },
          {
            category: 'promotion',
            type: 'relative',
            amount: {
              relative: 0.3,
              absoluteWithTax: 2000 as CentAmount,
            },
          },
        ],
      })
      const { totalPromotionReductions } = useBasketPromotionReductions(
        toRef(cost),
        toRef(basketItemsFactory.build()),
      )
      expect(totalPromotionReductions.value).toEqual(3000)
    })

    it('should return 0 if no promotion reductions', () => {
      const cost = costFactory.build({
        withTax: 1000,
        appliedReductions: [
          {
            category: 'sale',
            type: 'relative',
            amount: {
              relative: 0.3,
              absoluteWithTax: 4000 as CentAmount,
            },
          },
        ],
      })
      const { totalPromotionReductions } = useBasketPromotionReductions(
        toRef(cost),
        toRef(basketItemsFactory.build()),
      )
      expect(totalPromotionReductions.value).toEqual(0)
    })
  })

  describe('basketPromotionSummaries', () => {
    it('should return promotions & total with promotion reduction basket items', () => {
      const cost = costFactory.build({
        withTax: 1000,
        appliedReductions: [
          {
            category: 'campaign',
            type: 'relative',
            amount: {
              relative: 0.3,
              absoluteWithTax: 4000 as CentAmount,
            },
          },
          {
            category: 'promotion',
            type: 'relative',
            amount: {
              relative: 0.2,
              absoluteWithTax: 1000 as CentAmount,
            },
          },
          {
            category: 'promotion',
            type: 'relative',
            amount: {
              relative: 0.3,
              absoluteWithTax: 2000 as CentAmount,
            },
          },
        ],
      })

      const priceTotalForFirstItem = priceFactory.build({
        appliedReductions: [
          {
            category: 'sale',
            type: 'relative',
            amount: {
              relative: 0.5,
              absoluteWithTax: 4500 as CentAmount,
            },
          },
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

      const priceTotalForSecondItem = priceFactory.build({
        appliedReductions: [
          {
            category: 'sale',
            type: 'relative',
            amount: {
              relative: 0.5,
              absoluteWithTax: 4500 as CentAmount,
            },
          },
          {
            category: 'promotion',
            type: 'relative',
            amount: {
              relative: 0.2,
              absoluteWithTax: 4000 as CentAmount,
            },
          },
        ],
      })

      const items = [
        basketItemFactory.build({
          key: 'baket-item-test-1',
          price: {
            total: priceTotalForFirstItem,
            unit: priceTotalForFirstItem,
          },
          promotionId: 'promotion-id-1',
          promotion: promotionFactory.build({
            id: 'promotion-id-1',
            effect: {
              type: PromotionEffectType.AutomaticDiscount,
              additionalData: {
                type: 'relative',
                value: 20,
              },
            },
          }),
        }),
        basketItemFactory.build({
          key: 'baket-item-test-2',
          price: {
            total: priceTotalForSecondItem,
            unit: priceTotalForSecondItem,
          },
          promotionId: 'promotion-id-2',
          promotion: promotionFactory.build({
            id: 'promotion-id-2',
            effect: {
              type: PromotionEffectType.AutomaticDiscount,
              additionalData: {
                type: 'relative',
                value: 20,
              },
            },
          }),
        }),

        basketItemFactory.build({ key: 'basket-item-test-3' }),
      ]
      const { basketPromotionSummaries } = useBasketPromotionReductions(
        toRef(cost),
        toRef(items),
      )

      const [firstPromotionBasketItem, secondPromotionalBasketItem] =
        basketPromotionSummaries.value.values()

      expect(basketPromotionSummaries.value.size).toBeTruthy()

      expect(firstPromotionBasketItem.total).toEqual(898)
      expect(firstPromotionBasketItem?.promotion?.id).toEqual('promotion-id-1')

      expect(secondPromotionalBasketItem.total).toEqual(4000)
      expect(secondPromotionalBasketItem?.promotion?.id).toEqual(
        'promotion-id-2',
      )
    })

    it('should return an empty map for basket items with no promotions', () => {
      const cost = costFactory.build({
        withTax: 1000,
        appliedReductions: [
          {
            category: 'sale',
            type: 'relative',
            amount: {
              relative: 0.3,
              absoluteWithTax: 4000 as CentAmount,
            },
          },
        ],
      })

      const items = [basketItemFactory.build({ key: 'basket-item-test-1' })]

      const { basketPromotionSummaries } = useBasketPromotionReductions(
        toRef(cost),
        toRef(items),
      )
      expect(basketPromotionSummaries.value).toEqual(new Map())
    })
  })
})
