import { it, describe, expect } from 'vitest'
import type { BasketResponseData, CentAmount } from '@scayle/storefront-nuxt'
import type { BasketKey } from '@scayle/storefront-api'
import {
  costFactory,
  basketItemsFactory,
} from '@scayle/storefront-nuxt/test/factories'
import {
  getBasketTotalWithoutPromotions,
  getTotalPriceWithoutReductions,
  getTotalReductionsByCategory,
} from './basket'

describe('getBasketTotalWithoutPromotions', () => {
  it('should return total without promotions', () => {
    const basket: BasketResponseData = {
      key: 'basket-key' as BasketKey,
      cost: costFactory.build({
        withTax: 1000 as CentAmount,
        withoutTax: 1200 as CentAmount,
        appliedReductions: [
          {
            category: 'promotion',
            type: 'absolute',
            amount: {
              relative: 500,
              absoluteWithTax: 500 as CentAmount,
            },
          },
          {
            category: 'campaign',
            type: 'absolute',
            amount: {
              relative: 200,
              absoluteWithTax: 200 as CentAmount,
            },
          },
        ],
        currencyCode: 'EUR',
      }),
      currencyCode: 'EUR',
      items: basketItemsFactory.build(),
      packages: [
        {
          id: 1,
          carrierKey: 'test',
          deliveryDate: {
            max: new Date().toISOString(),
            min: new Date().toISOString(),
          },
        },
      ],
      applicablePromotions: [],
    }

    const totalWithoutPromotions = getBasketTotalWithoutPromotions(basket)

    expect(totalWithoutPromotions).toEqual(1500)
  })

  it('should return zero if no basket data provided', () => {
    expect(getBasketTotalWithoutPromotions()).toEqual(0)
  })
})

describe('getTotalReductionsByCategory', () => {
  it('should return total sale reductions', () => {
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
    expect(getTotalReductionsByCategory(cost, 'sale')).toEqual(3000)
  })

  it('should return total campaign reductions', () => {
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
    expect(getTotalReductionsByCategory(cost, 'campaign')).toEqual(6000)
  })
})

describe('getTotalPriceWithoutReductions', () => {
  it('should return original price with applied reductions', () => {
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
    expect(getTotalPriceWithoutReductions(cost)).toEqual(4898)
  })

  it('should return original price without reductions', () => {
    const cost = costFactory.build({
      withTax: 1000,
      appliedReductions: [],
    })
    expect(getTotalPriceWithoutReductions(cost)).toEqual(1000)
  })
})
