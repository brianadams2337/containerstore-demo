import { describe, it, expect } from 'vitest'
import type { CentAmount } from '@scayle/storefront-nuxt'
import { PromotionEffectType } from '@scayle/storefront-api'
import { toRef } from 'vue'
import { useBasketReductions } from './useBasketReductions'
import {
  costFactory,
  basketItemsFactory,
  basketItemFactory,
} from '~/test/factories/basket'
import { priceFactory } from '~/test/factories/price'
import { promotionFactory } from '~/test/factories/promotion'

describe('useBasketReductions', () => {
  describe('totalSaleReductions', () => {
    it('should return total sum of sale reductions', () => {
      const cost = costFactory.build({
        withTax: 1000,
        appliedReductions: [
          {
            category: 'sale',
            type: 'relative',
            amount: {
              relative: 0.3,
              absoluteWithTax: 1000 as CentAmount,
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
          {
            category: 'sale',
            type: 'relative',
            amount: {
              relative: 0.3,
              absoluteWithTax: 2000 as CentAmount,
            },
          },
        ],
      })
      const { totalSaleReductions } = useBasketReductions(
        toRef(cost),
        toRef(basketItemsFactory.build()),
      )
      expect(totalSaleReductions.value).toEqual(3000)
    })

    it('should return 0 if no sale reductions', () => {
      const cost = costFactory.build({
        withTax: 1000,
        appliedReductions: [
          {
            category: 'campaign',
            type: 'relative',
            amount: {
              relative: 0.3,
              absoluteWithTax: 2000 as CentAmount,
            },
          },
        ],
      })
      const { totalSaleReductions } = useBasketReductions(
        toRef(cost),
        toRef(basketItemsFactory.build()),
      )
      expect(totalSaleReductions.value).toEqual(0)
    })
  })

  describe('totalCampaignReductions', () => {
    it('should return total sum of campaign reductions', () => {
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
              absoluteWithTax: 898 as CentAmount,
            },
          },
          {
            category: 'campaign',
            type: 'relative',
            amount: {
              relative: 0.3,
              absoluteWithTax: 2000 as CentAmount,
            },
          },
        ],
      })
      const { totalCampaignReductions } = useBasketReductions(
        toRef(cost),
        toRef(basketItemsFactory.build()),
      )
      expect(totalCampaignReductions.value).toEqual(6000)
    })

    it('should return 0 if no campaign reductions', () => {
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
      const { totalCampaignReductions } = useBasketReductions(
        toRef(cost),
        toRef(basketItemsFactory.build()),
      )
      expect(totalCampaignReductions.value).toEqual(0)
    })
  })

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
      const { totalPromotionReductions } = useBasketReductions(
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
      const { totalPromotionReductions } = useBasketReductions(
        toRef(cost),
        toRef(basketItemsFactory.build()),
      )
      expect(totalPromotionReductions.value).toEqual(0)
    })
  })

  describe('itemsWithPromotionReductions', () => {
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
      const { itemsWithPromotionReductions } = useBasketReductions(
        toRef(cost),
        toRef(items),
      )

      const [firstPromotionBasketItem, secondPromotionalBasketItem] =
        itemsWithPromotionReductions.value

      expect(itemsWithPromotionReductions.value.length).toBeTruthy()

      expect(firstPromotionBasketItem.total).toEqual(898)
      expect(firstPromotionBasketItem?.promotion?.id).toEqual('promotion-id-1')

      expect(secondPromotionalBasketItem.total).toEqual(4000)
      expect(secondPromotionalBasketItem?.promotion?.id).toEqual(
        'promotion-id-2',
      )
    })

    it('should return an empty array for basket items with no promotions', () => {
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

      const { itemsWithPromotionReductions } = useBasketReductions(
        toRef(cost),
        toRef(items),
      )
      expect(itemsWithPromotionReductions.value).toEqual([])
    })
  })

  describe('hasReductions', () => {
    it('should return "true" if there is atleast one reduction', () => {
      const cost = costFactory.build({
        withTax: 1000,
        appliedReductions: [
          {
            category: 'sale',
            type: 'relative',
            amount: {
              relative: 0.3,
              absoluteWithTax: 1000 as CentAmount,
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
          {
            category: 'sale',
            type: 'relative',
            amount: {
              relative: 0.3,
              absoluteWithTax: 2000 as CentAmount,
            },
          },
        ],
      })
      const { hasReductions } = useBasketReductions(
        toRef(cost),
        toRef(basketItemsFactory.build()),
      )
      expect(hasReductions.value).toEqual(true)
    })

    it('should return "false" if there is no reductions', () => {
      const cost = costFactory.build()
      cost.appliedReductions = []
      const { hasReductions } = useBasketReductions(
        toRef(cost),
        toRef(basketItemsFactory.build()),
      )
      expect(hasReductions.value).toEqual(false)
    })
  })
})
