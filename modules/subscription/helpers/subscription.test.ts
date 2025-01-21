import { describe, expect, it, vi } from 'vitest'
import type { BasketItem } from '@scayle/storefront-core'
import {
  getSubscriptionItemGroup,
  hasSubscriptionCustomData,
  isProductSubscriptionEligible,
  SUBSCRIPTION_ELIGIBILITY_ATTRIBUTE_NAME,
} from './subscription'
import { productFactory } from '~/test/factories/product'
import { variantFactory } from '~/test/factories/variant'
import type { AddToBasketItem } from '~/composables'
import { basketItemFactory } from '~/test/factories/basket'

describe('hasSubscriptionCustomData', () => {
  it('should return true for when subscriptionDefinition property is present', () => {
    expect(
      hasSubscriptionCustomData({
        subscriptionDefinition: {},
      }),
    ).toBe(true)
  })

  it('should return false for when subscriptionDefinition property is not present', () => {
    expect(hasSubscriptionCustomData({})).toBe(false)
  })
  it('should return false when undefined was passed', () => {
    expect(hasSubscriptionCustomData(undefined)).toBe(false)
  })
})

describe('isProductSubscriptionEligible', () => {
  it('should return false when the product has no variants', () => {
    const product = productFactory.build({ variants: [] })
    expect(isProductSubscriptionEligible(product)).toBe(false)
  })
  it('should return false when none of the variants has the subscriptionEligibility  attribute set to true', () => {
    const product = productFactory.build({
      variants: [variantFactory.build({ attributes: {} })],
    })
    expect(isProductSubscriptionEligible(product)).toBe(false)
  })

  it('should return true when one of the variants has the subscriptionEligibility attribute set to true', () => {
    const product = productFactory.build({
      variants: [
        variantFactory.build({
          attributes: {
            [SUBSCRIPTION_ELIGIBILITY_ATTRIBUTE_NAME]: {
              id: 7644,
              key: 'subscriptionEligibility',
              label: 'Abonnement Verfügbarkeit',
              type: '',
              multiSelect: false,
              values: {
                id: 2641,
                label: 'true',
                value: 'true',
              },
            },
          },
        }),
      ],
    })
    expect(isProductSubscriptionEligible(product)).toBe(true)
  })
  it('should return true when multiple of the variants has the subscriptionEligibility attribute set to true', () => {
    const product = productFactory.build({
      variants: [
        variantFactory.build({
          id: 1,
          attributes: {
            [SUBSCRIPTION_ELIGIBILITY_ATTRIBUTE_NAME]: {
              id: 7644,
              key: 'subscriptionEligibility',
              label: 'Abonnement Verfügbarkeit',
              type: '',
              multiSelect: false,
              values: {
                id: 2641,
                label: 'true',
                value: 'true',
              },
            },
          },
        }),
        variantFactory.build({
          id: 2,
          attributes: {
            [SUBSCRIPTION_ELIGIBILITY_ATTRIBUTE_NAME]: {
              id: 7644,
              key: 'subscriptionEligibility',
              label: 'Abonnement Verfügbarkeit',
              type: '',
              multiSelect: false,
              values: {
                id: 2641,
                label: 'true',
                value: 'true',
              },
            },
          },
        }),
      ],
    })
    expect(isProductSubscriptionEligible(product)).toBe(true)
  })
})

describe('getSubscriptionItemGroup', () => {
  it('should return existing item group of item', () => {
    const addToBasketItem: AddToBasketItem = {
      productName: 'Test',
      quantity: 1,
      variantId: 1,
      itemGroup: { id: 'test', isMainItem: true, isRequired: true },
    }
    expect(getSubscriptionItemGroup(addToBasketItem, [])).toEqual({
      id: 'test',
      isMainItem: true,
      isRequired: true,
    })
  })

  it('should reuse item group of existing subscription item', () => {
    const addToBasketItem: AddToBasketItem = {
      productName: 'Test',
      quantity: 1,
      variantId: 1,
    }
    const basketItems = [
      basketItemFactory.build({
        variant: { id: 1 },
        customData: {
          subscriptionDefinition: {},
        },
        itemGroup: { id: 'test', isMainItem: true, isRequired: true },
      }),
    ]

    expect(getSubscriptionItemGroup(addToBasketItem, basketItems)).toEqual({
      id: 'test',
      isMainItem: true,
      isRequired: true,
    })
  })

  it('should create a new item group for subscription item', () => {
    vi.mock('nanoid', () => {
      return {
        nanoid: () => 'nanoid',
      }
    })
    const addToBasketItem: AddToBasketItem = {
      productName: 'Test',
      quantity: 1,
      variantId: 1,
    }
    const basketItems: BasketItem[] = []
    expect(getSubscriptionItemGroup(addToBasketItem, basketItems)).toEqual({
      id: 'nanoid',
      isMainItem: true,
      isRequired: true,
    })
  })
})
