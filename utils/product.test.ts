import type { CentAmount, Price } from '@scayle/storefront-nuxt'
import { it, describe, expect } from 'vitest'
import {
  getProductSiblings,
  getProductSiblingData,
  getApplicablePromotionsForProduct,
  getCombineWithProductIds,
  createCustomPrice,
} from './product'
import { productFactory } from '~/test/factories/product'
import {
  advancedAttributeFactory,
  attributeGroupFactory,
} from '~/test/factories/attribute'
import { promotionFactory } from '~/test/factories/promotion'

// TODO: Cover more cases (e.g return data set check, different color attribute name etc.)
describe('getApplicablePromotionsForProduct', () => {
  it('should get the applicable promotion for the product with single promotion', () => {
    const product = productFactory.build({
      attributes: {
        promotion: attributeGroupFactory.build({
          key: 'promotion',
          values: {
            id: 2432,
            label: '20% on Everything',
            value: '20_on_everything',
          },
        }),
      },
    })
    const promotions = [
      promotionFactory.build({
        customData: {
          product: {
            badgeLabel: '-20% Off',
            promotionId: 2432,
          },
        },
      }),
      promotionFactory.build({
        customData: {
          product: {
            badgeLabel: '-20% Off',
            promotionId: 9999,
          },
        },
      }),
    ]
    const result = getApplicablePromotionsForProduct(product, promotions)

    expect(result).toEqual([promotions[0]])
  })

  it('should get the applicable priority sorted promotion for the product with multiple promotions', () => {
    const product = productFactory.build({
      attributes: {
        promotion: attributeGroupFactory.build({
          key: 'promotion',
          multiSelect: true,
          values: [
            {
              id: 2477,
              value: 'free_caps',
              label: 'Free Caps',
            },
            {
              id: 2432,
              label: '20% on Everything',
              value: '20_on_everything',
            },
          ],
        }),
      },
    })
    const promotions = [
      promotionFactory.build({
        id: '1',
        customData: {
          product: {
            badgeLabel: '-20% Off',
            promotionId: 2432,
          },
        },
        priority: 1,
      }),
      promotionFactory.build({
        id: '2',
        customData: {
          product: {
            badgeLabel: 'Free Caps',
            promotionId: 2477,
          },
        },
        priority: 9,
      }),
    ]

    const result = getApplicablePromotionsForProduct(product, promotions)

    expect(result).toEqual([promotions[1]])
  })
})

describe('getProductSiblings', () => {
  it('returns active, sold out and with current product included siblings by default', ({
    expect,
  }) => {
    const product = productFactory.build({
      id: 1,
      siblings: [
        productFactory.build({ id: 2, isActive: true, isSoldOut: false }),
        productFactory.build({ id: 3, isActive: false, isSoldOut: true }),
      ],
    })
    const siblings = getProductSiblings(product, 'color')
    expect(siblings.map((item) => item.id)).toEqual([1, 2, 3])
  })

  it('returns product siblings without current product', ({ expect }) => {
    const product = productFactory.build({
      id: 1,
      siblings: [
        productFactory.build({ id: 2, isActive: true, isSoldOut: false }),
        productFactory.build({ id: 3, isActive: false, isSoldOut: true }),
      ],
    })
    const siblings = getProductSiblings(product, 'color', {
      includeCurrentProduct: false,
    })
    expect(siblings.map((item) => item.id)).toEqual([2, 3])
  })

  it('omits sold out siblings', ({ expect }) => {
    const product = productFactory.build({
      id: 1,
      siblings: [
        productFactory.build({ id: 2, isActive: true, isSoldOut: false }),
        productFactory.build({ id: 3, isActive: false, isSoldOut: true }),
      ],
    })
    const siblings = getProductSiblings(product, 'color', { omitSoldOut: true })
    expect(siblings.map((item) => item.id)).toEqual([1, 2])
  })

  it('sold out siblings are sorted to the end', ({ expect }) => {
    const product = productFactory.build({
      id: 1,
      siblings: [
        productFactory.build({ id: 2, isActive: false, isSoldOut: true }),
        productFactory.build({ id: 3, isActive: true, isSoldOut: false }),
      ],
    })
    const siblings = getProductSiblings(product, 'color', {
      sortBySoldOut: true,
    })
    expect(siblings.map((item) => item.id)).toEqual([1, 3, 2])
  })
})

describe('getProductSiblingData', () => {
  it('should return product sibling data', ({ expect }) => {
    const product = productFactory.build({
      id: 1,
      images: [
        {
          hash: 'images/fe8ee645c772b98de23b00e4f600a613.png',
          attributes: {},
        },
      ],
      isActive: true,
      isSoldOut: false,
      attributes: {
        name: attributeGroupFactory.build({
          values: {
            label: "HUGO Sweatshirt 'Dakimara'",
          },
        }),
        color: attributeGroupFactory.build({
          values: {
            id: 6,
            label: 'Weiß',
            value: 'weiss',
          },
        }),
      },
    })
    const sibling = getProductSiblingData(product, 'color')
    expect(sibling).toStrictEqual({
      id: 1,
      name: "HUGO Sweatshirt 'Dakimara'",
      image: {
        hash: 'images/fe8ee645c772b98de23b00e4f600a613.png',
        attributes: {},
      },
      colors: [
        {
          id: 6,
          label: 'Weiß',
          value: 'weiss',
        },
      ],
      isSoldOut: false,
    })
  })
})

describe('getCombineWithProductIds', () => {
  it('should return productIds from data', ({ expect }) => {
    const combineWithAttribute = advancedAttributeFactory.build({
      key: 'combineWith',
      label: 'Kombiniere mit',
      values: [
        {
          fieldSet: [
            [
              {
                value: '206131',
              },
            ],
          ],
          groupSet: [],
        },
        {
          fieldSet: [
            [
              {
                value: '206017',
              },
            ],
          ],
          groupSet: [],
        },
        {
          fieldSet: [
            [
              {
                value: '206012',
              },
            ],
          ],
          groupSet: [],
        },
      ],
    })
    expect(getCombineWithProductIds(combineWithAttribute)).toStrictEqual([
      206131, 206017, 206012,
    ])
  })
  it('should return empty array when attribute is not available', ({
    expect,
  }) => {
    expect(getCombineWithProductIds(undefined)).toStrictEqual([])
  })
  it('should return productIds ignore invalid data', ({ expect }) => {
    const combineWithAttributeWithInvalidData = advancedAttributeFactory.build({
      key: 'combineWith',
      label: 'Kombiniere mit',
      values: [
        {
          fieldSet: [
            [
              {
                value: '206131',
              },
            ],
            [
              {
                value: 'TEST',
              },
            ],
          ],
          groupSet: [],
        },
        {
          fieldSet: [
            [
              {
                value: '206017',
              },
            ],
          ],
          groupSet: [],
        },
        {
          fieldSet: [
            [
              {
                value: '206012',
              },
            ],
          ],
          groupSet: [],
        },
      ],
    })
    expect(
      getCombineWithProductIds(combineWithAttributeWithInvalidData),
    ).toStrictEqual([206131, 206017, 206012])
  })
})

describe('createCustomPrice', () => {
  it('should replace product prices attribute with given value', () => {
    const price: Price = {
      currencyCode: 'EUR',
      withTax: 8990 as CentAmount,
      withoutTax: 7555 as CentAmount,
      appliedReductions: [],
      tax: {
        vat: {
          amount: 1435 as CentAmount,
          rate: 0.19,
        },
      },
    }

    const customPrice = createCustomPrice(price, { withTax: 0 as CentAmount })

    expect(customPrice).toStrictEqual({
      currencyCode: 'EUR',
      withTax: 0 as CentAmount,
      withoutTax: 7555 as CentAmount,
      appliedReductions: [],
      tax: {
        vat: {
          amount: 1435 as CentAmount,
          rate: 0.19,
        },
      },
    })
  })
})
