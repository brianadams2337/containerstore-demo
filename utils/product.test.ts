import type { CentAmount, Product } from '@scayle/storefront-nuxt'
import { it, describe } from 'vitest'
import { getProductSiblings, getProductSiblingData } from './product'

// TODO: Add tests for remaining product utils

const CREATED_AT = '2022-04-26T15:04:56+00:00'

const getProductData = (): Omit<Product, 'id' | 'isActive' | 'isSoldOut'> => ({
  isNew: false,
  createdAt: CREATED_AT,
  updatedAt: '2022-06-21T20:02:33+00:00',
  masterKey: 'HGO3464001000001',
  referenceKey: '1',
  attributes: {
    color: {
      id: 1001,
      key: 'color',
      label: 'Color',
      type: '',
      multiSelect: false,
      values: {
        id: 6,
        label: 'Weiß',
        value: 'weiss',
      },
    },
    brand: {
      id: 550,
      key: 'brand',
      label: 'Marke',
      type: '',
      multiSelect: false,
      values: {
        id: 63,
        label: 'HUGO',
        value: 'hugo',
      },
    },
    name: {
      id: 20005,
      key: 'name',
      label: 'Name',
      type: null,
      multiSelect: false,
      values: {
        label: "HUGO Sweatshirt 'Dakimara'",
      },
    },
  },
  lowestPriorPrice: {
    withTax: null,
    relativeDifferenceToPrice: null,
  },
  images: [
    {
      hash: 'images/fe8ee645c772b98de23b00e4f600a613.png',
      attributes: {},
    },
  ],
  variants: [],
  siblings: [],
  priceRange: {
    min: {
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
    },
    max: {
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
    },
  },
  categories: [
    [
      {
        categoryId: 2045,
        categoryName: 'Women',
        categoryUrl: '/women',
        categoryProperties: [],
      },
    ],
  ],
})

// TODO: Cover more cases (e.g return data set check, different color attribute name etc.)
describe('getProductSiblings', () => {
  it('returns active, sold out and with current product included siblings by default', ({
    expect,
  }) => {
    const product: Product = {
      id: 1,
      isActive: true,
      isSoldOut: false,
      ...getProductData(),
      siblings: [
        {
          id: 2,
          isActive: true,
          isSoldOut: false,
          ...getProductData(),
        },
        {
          id: 3,
          isActive: false,
          isSoldOut: false,
          ...getProductData(),
        },
      ],
    }
    const siblings = getProductSiblings(product, 'color', { omitSoldOut: true })
    expect(siblings.map((item) => item.id)).toEqual([1, 2])
  })

  it('returns product siblings without current product', ({ expect }) => {
    const product: Product = {
      id: 1,
      isActive: true,
      isSoldOut: false,
      ...getProductData(),
      siblings: [
        {
          id: 2,
          isActive: true,
          isSoldOut: false,
          ...getProductData(),
        },
        {
          id: 3,
          isActive: false,
          isSoldOut: false,
          ...getProductData(),
        },
      ],
    }
    const siblings = getProductSiblings(product, 'color', {
      includeCurrentProduct: false,
    })
    expect(siblings.map((item) => item.id)).toEqual([2])
  })
})

describe('getProductSiblingData', () => {
  it('should return product sibling data', ({ expect }) => {
    const product: Product = {
      id: 1,
      isActive: true,
      isSoldOut: false,
      ...getProductData(),
      attributes: {
        color: {
          id: 1001,
          key: 'color',
          label: 'Color',
          type: '',
          multiSelect: false,
          values: {
            id: 6,
            label: 'Weiß',
            value: 'weiss',
          },
        },
      },
      images: [
        {
          hash: 'images/fe8ee645c772b98de23b00e4f600a613.png',
          attributes: {},
        },
      ],
    }
    const sibling = getProductSiblingData(product, 'color')
    expect(sibling).toStrictEqual({
      id: 1,
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
    })
  })
})
