import type {
  AutomaticDiscountEffect,
  BuyXGetYEffect,
  CentAmount,
  Product,
  Promotion,
  RFC33339Date,
} from '@scayle/storefront-nuxt'
import { it, describe, expect } from 'vitest'
import {
  getProductSiblings,
  getProductSiblingData,
  getApplicablePromotionsForProduct,
} from './product'

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
const getCurrentPromotionsData = (): Promotion[] => [
  {
    id: '66951014684cc17335766006',
    name: '10% on Jackets above 100€',
    schedule: {
      from: '2024-07-15T10:00:00Z' as RFC33339Date,
      to: '2025-04-01T10:00:00Z' as RFC33339Date,
    },
    isActive: true,
    effect: {
      type: 'automatic_discount',
      additionalData: {
        type: 'relative',
        value: 10,
      },
    } as AutomaticDiscountEffect,
    conditions: [
      {
        level: 'global',
        key: 'panels_automatic-discount_any_products_condition_e5b66afa5eacabdb6bb855c6a9344db49cc372b4',
        condition: 'size(payload.items) \u003E= 1',
      },
      {
        level: 'global',
        key: 'panels_automatic-discount_minimum_order_amount_10000',
        condition: 'payload.totals.withTax \u003E= 10000',
      },
    ],
    customData: {
      product: {
        badgeLabel: 'Get -10% Off',
        promotionId: 2476,
      },
      terms:
        'The promotion applies to Jackets products. If you buy 1 or more jacket products that are worth over 100€, you will get 10% discount on your order. The promotion lasts till the end of April 1st, 2024.',
      category: {
        ctaLabel: 'Jacket Deals',
        id: 50353,
      },
      colorHex: '#a4c639',
      corePanel: {
        viewType: 'automatic-discount',
      },
      headlineParts: [
        'Autumn Jacket Campaign',
        'Buy jacket(s) worth 100€ & get 10% on it',
      ],
      minOrderValue: 10000,
    },
    priority: 1,
  },
  {
    id: '66951046684cc17335766008',
    name: '20% on Everything',
    schedule: {
      from: '2024-07-15T10:00:00Z' as RFC33339Date,
      to: '9999-12-30T10:00:00Z' as RFC33339Date,
    },
    isActive: true,
    effect: {
      type: 'automatic_discount',
      additionalData: {
        type: 'relative',
        value: 20,
      },
    } as AutomaticDiscountEffect,
    conditions: [
      {
        level: 'global',
        key: 'panels_automatic-discount_any_products_condition_e5b66afa5eacabdb6bb855c6a9344db49cc372b4',
        condition: 'size(payload.items) \u003E= 1',
      },
    ],
    customData: {
      category: {
        ctaLabel: 'Get Everything',
        id: 50341,
      },
      colorHex: '#f4c2c2',
      corePanel: {
        viewType: 'advanced',
      },
      headlineParts: ['Everything Deals', 'Buy everything  & get 20% on it'],
      product: {
        badgeLabel: '-20% Off',
        promotionId: 2432,
      },
      terms:
        'The promotion applies to everything. If you buy 1 or more of everything, you will get 20% discount on these products. The promotion lasts till the end of eternity.',
    },
    priority: 2,
  },
  {
    id: '66962bd0684cc1733576601d',
    name: 'Free Caps',
    schedule: {
      from: '2024-07-15T10:00:00Z' as RFC33339Date,
      to: '2025-04-01T10:00:00Z' as RFC33339Date,
    },
    isActive: true,
    effect: {
      type: 'buy_x_get_y',
      additionalData: {
        maxCount: 1,
        maxCountType: 'per_eligible_uniq_items',
        variantIds: [
          322665, 322666, 322667, 323197, 323198, 323199, 323205, 323206,
          323243, 323244,
        ],
      },
    } as BuyXGetYEffect,
    conditions: [
      {
        level: 'global',
        key: 'panels_buy-x-get-y_any_products_condition_e5b66afa5eacabdb6bb855c6a9344db49cc372b4',
        condition: 'size(payload.items) \u003E= 1',
      },
    ],
    customData: {
      giftConditions: {
        minQuantity: 1,
      },
      headlineParts: ['Free Gift Deal', 'Buy sneakers, and get a free cap'],
      product: {
        badgeLabel: 'Get a Cap',
        promotionId: 2477,
      },
      terms:
        "By buying one of the sneakers tagged with the badge 'Get a Cap', you can get a free cap. The promotion lasts till the end of March 2025.",
      category: {
        ctaLabel: 'Sneakers',
        id: 50344,
      },
      colorHex: '#6699cc',
      corePanel: {
        viewType: 'buy-x-get-y',
      },
    },
    priority: 3,
  },
]

// TODO: Cover more cases (e.g return data set check, different color attribute name etc.)
describe('getApplicablePromotionsForProduct', () => {
  it('should get the applicable promotion for the product with single promotion', () => {
    const product: Product = {
      id: 1,
      isActive: true,
      isSoldOut: false,
      ...getProductData(),
    }
    product.attributes!.promotion = {
      id: 6102,
      key: 'promotion',
      label: 'Promotion',
      type: '',
      multiSelect: false,
      values: {
        id: 2432,
        label: '20% on Everything',
        value: '20_on_everything',
      },
    }

    const currentPromotions: Promotion[] = getCurrentPromotionsData()

    const result = getApplicablePromotionsForProduct(product, currentPromotions)

    expect(result).toEqual([
      {
        id: '66951046684cc17335766008',
        name: '20% on Everything',
        schedule: {
          from: '2024-07-15T10:00:00Z' as RFC33339Date,
          to: '9999-12-30T10:00:00Z' as RFC33339Date,
        },
        isActive: true,
        effect: {
          type: 'automatic_discount',
          additionalData: {
            type: 'relative',
            value: 20,
          },
        } as AutomaticDiscountEffect,
        conditions: [
          {
            level: 'global',
            key: 'panels_automatic-discount_any_products_condition_e5b66afa5eacabdb6bb855c6a9344db49cc372b4',
            condition: 'size(payload.items) \u003E= 1',
          },
        ],
        customData: {
          category: {
            ctaLabel: 'Get Everything',
            id: 50341,
          },
          colorHex: '#f4c2c2',
          corePanel: {
            viewType: 'advanced',
          },
          headlineParts: [
            'Everything Deals',
            'Buy everything  & get 20% on it',
          ],
          product: {
            badgeLabel: '-20% Off',
            promotionId: 2432,
          },
          terms:
            'The promotion applies to everything. If you buy 1 or more of everything, you will get 20% discount on these products. The promotion lasts till the end of eternity.',
        },
        priority: 2,
      },
    ])
  })

  it('should get the applicable priority sorted promotion for the product with multiple promotions', () => {
    const product: Product = {
      id: 1,
      isActive: true,
      isSoldOut: false,
      ...getProductData(),
    }
    product.attributes!.promotion = {
      id: 6102,
      key: 'promotion',
      label: 'Promotion',
      type: '',
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
    }

    const currentPromotions: Promotion[] = getCurrentPromotionsData()

    const result = getApplicablePromotionsForProduct(product, currentPromotions)

    expect(result).toEqual([
      {
        id: '66962bd0684cc1733576601d',
        name: 'Free Caps',
        schedule: {
          from: '2024-07-15T10:00:00Z' as RFC33339Date,
          to: '2025-04-01T10:00:00Z' as RFC33339Date,
        },
        isActive: true,
        effect: {
          type: 'buy_x_get_y',
          additionalData: {
            maxCount: 1,
            maxCountType: 'per_eligible_uniq_items',
            variantIds: [
              322665, 322666, 322667, 323197, 323198, 323199, 323205, 323206,
              323243, 323244,
            ],
          },
        } as BuyXGetYEffect,
        conditions: [
          {
            level: 'global',
            key: 'panels_buy-x-get-y_any_products_condition_e5b66afa5eacabdb6bb855c6a9344db49cc372b4',
            condition: 'size(payload.items) \u003E= 1',
          },
        ],
        customData: {
          giftConditions: {
            minQuantity: 1,
          },
          headlineParts: ['Free Gift Deal', 'Buy sneakers, and get a free cap'],
          product: {
            badgeLabel: 'Get a Cap',
            promotionId: 2477,
          },
          terms:
            "By buying one of the sneakers tagged with the badge 'Get a Cap', you can get a free cap. The promotion lasts till the end of March 2025.",
          category: {
            ctaLabel: 'Sneakers',
            id: 50344,
          },
          colorHex: '#6699cc',
          corePanel: {
            viewType: 'buy-x-get-y',
          },
        },
        priority: 3,
      },
    ])
  })
})

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
    })
  })
})
