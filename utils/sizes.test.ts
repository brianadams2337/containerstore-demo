import type {
  CentAmount,
  Product,
  RFC33339Date,
  Variant,
} from '@scayle/storefront-nuxt'
import { it, describe, expect } from 'vitest'
import { getVariantSizes, hasOneSizeProductVariantOnly } from './sizes'

const getProductData = (): Product => ({
  id: 206139,
  isActive: true,
  isSoldOut: false,
  isNew: false,
  createdAt: '2024-07-13T10:48:19+00:00',
  updatedAt: '2024-07-13T11:40:59+00:00',
  masterKey: 'MBU94-131',
  referenceKey: 'ID7056-pc',
  images: [
    {
      hash: 'images/a524c9571c739c4c87850f5b7c365f3a.jpg',
    },
  ],
})

const getProductVariantsData = (): Variant[] => [
  {
    id: 324633,
    referenceKey: 'Ado7119001000009',
    createdAt: '2024-07-13T10:48:19+00:00' as RFC33339Date,
    updatedAt: '2024-08-06T14:41:47+00:00' as RFC33339Date,
    attributes: {
      size: {
        id: 1001,
        key: 'size',
        label: 'Größe',
        type: 'size',
        multiSelect: false,
        values: {
          id: 2319,
          label: '7,5',
          value: '75',
        },
      },
    },
    stock: {
      supplierId: 3,
      warehouseId: 58,
      quantity: 5,
      isSellableWithoutStock: false,
    },
    price: {
      currencyCode: 'EUR',
      withTax: 11900 as CentAmount,
      withoutTax: 5950 as CentAmount,
      tax: {
        vat: {
          amount: 5950 as CentAmount,
          rate: 0.999999,
        },
      },
      appliedReductions: [],
    },
  },
  {
    id: 324634,
    referenceKey: 'Ado7119001000011',
    createdAt: '2024-07-13T10:48:19+00:00' as RFC33339Date,
    updatedAt: '2024-08-06T14:41:46+00:00' as RFC33339Date,
    attributes: {
      size: {
        id: 1001,
        key: 'size',
        label: 'Größe',
        type: 'size',
        multiSelect: false,
        values: {
          id: 2329,
          label: '3',
          value: '3',
        },
      },
    },
    stock: {
      supplierId: 3,
      warehouseId: 58,
      quantity: 0,
      isSellableWithoutStock: false,
    },
    price: {
      currencyCode: 'EUR',
      withTax: 11900 as CentAmount,
      withoutTax: 5950 as CentAmount,
      tax: {
        vat: {
          amount: 5950 as CentAmount,
          rate: 0.999999,
        },
      },
      appliedReductions: [],
    },
  },
  {
    id: 324635,
    referenceKey: 'Ado7119001000001',
    createdAt: '2024-07-13T10:48:19+00:00' as RFC33339Date,
    updatedAt: '2024-08-06T14:41:47+00:00' as RFC33339Date,
    attributes: {
      size: {
        id: 1001,
        key: 'size',
        label: 'Größe',
        type: 'size',
        multiSelect: false,
        values: {
          id: 2311,
          label: '3,5',
          value: '35',
        },
      },
    },
    stock: {
      supplierId: 3,
      warehouseId: 58,
      quantity: 2,
      isSellableWithoutStock: false,
    },
    price: {
      currencyCode: 'EUR',
      withTax: 11900 as CentAmount,
      withoutTax: 5950 as CentAmount,
      tax: {
        vat: {
          amount: 5950 as CentAmount,
          rate: 0.999999,
        },
      },
      appliedReductions: [],
    },
  },
  {
    id: 324636,
    referenceKey: 'Ado7119001000002',
    createdAt: '2024-07-13T10:48:19+00:00' as RFC33339Date,
    updatedAt: '2024-08-06T14:41:47+00:00' as RFC33339Date,
    attributes: {
      size: {
        id: 1001,
        key: 'size',
        label: 'Größe',
        type: 'size',
        multiSelect: false,
        values: {
          id: 2312,
          label: '4',
          value: '4',
        },
      },
    },
    stock: {
      supplierId: 3,
      warehouseId: 58,
      quantity: 2,
      isSellableWithoutStock: false,
    },
    price: {
      currencyCode: 'EUR',
      withTax: 11900 as CentAmount,
      withoutTax: 5950 as CentAmount,
      tax: {
        vat: {
          amount: 5950 as CentAmount,
          rate: 0.999999,
        },
      },
      appliedReductions: [],
    },
  },
]

describe('getVariantSizes', () => {
  it('should return a list of objects with variantId, availability, label and value, sorted by value', () => {
    const result = getVariantSizes(getProductVariantsData())

    expect(result).toEqual([
      {
        isAvailable: true,
        label: '7,5',
        value: '75',
        variantId: 324633,
      },
      {
        isAvailable: false,
        label: '3',
        value: '3',
        variantId: 324634,
      },
      {
        isAvailable: true,
        label: '3,5',
        value: '35',
        variantId: 324635,
      },
      {
        isAvailable: true,
        label: '4',
        value: '4',
        variantId: 324636,
      },
    ])
  })
})

describe('hasOneSizeProductVariantOnly', () => {
  it('should return false for product variant with more than one size', () => {
    const product = {
      ...getProductData(),
      variants: getProductVariantsData(),
    }

    const result = hasOneSizeProductVariantOnly(product)

    expect(result).toBe(false)
  })

  it('should return true for product variant with only a single size', () => {
    const product = {
      ...getProductData(),
      variants: [
        {
          id: 324633,
          createdAt: '2024-07-13T08:10:43+00:00' as RFC33339Date,
          updatedAt: '2024-08-06T14:41:47+00:00' as RFC33339Date,
          attributes: {
            size: {
              id: 1001,
              key: 'size',
              label: 'Größe',
              type: 'size',
              multiSelect: false,
              values: {
                id: 2365,
                label: 'One Size',
                value: 'one_size',
              },
            },
          },
          stock: {
            supplierId: 3,
            warehouseId: 58,
            quantity: 5,
            isSellableWithoutStock: false,
          },
          price: {
            currencyCode: 'EUR',
            withTax: 11900 as CentAmount,
            withoutTax: 5950 as CentAmount,
            tax: {
              vat: {
                amount: 5950 as CentAmount,
                rate: 0.999999,
              },
            },
            appliedReductions: [],
          },
        },
      ] as Variant[],
    }

    const result = hasOneSizeProductVariantOnly(product)

    expect(result).toBe(true)
  })
})
