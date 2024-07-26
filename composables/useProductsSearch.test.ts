import { type Ref } from 'vue'
import type { Product, CentAmount } from '@scayle/storefront-nuxt'
import { describe, beforeEach, it, vi, expect } from 'vitest'
import { useProductsSearch } from './useProductsSearch'
import type { NuxtError } from '#app'
import { createError } from '#app/composables/error'

function getProductData(): Omit<Product, 'id'> {
  const CREATED_AT = '2022-04-26T15:04:56+00:00'
  return {
    isActive: true,
    isSoldOut: false,
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
    categories: [],
  }
}

const mocks = vi.hoisted(() => {
  return {
    route: { query: {} },
    selectedSort: { value: '' },
    appliedFilter: { value: {} },
    useProducts: {
      data: {
        value: {
          products: [
            { id: 1, ...getProductData() },
            { id: 2, ...getProductData() },
            { id: 3, ...getProductData() },
            { id: 4, ...getProductData() },
          ],
          pagination: {
            current: 4,
            first: 1,
            last: 2,
            next: 1,
            page: 1,
            perPage: 2,
            prev: 1,
            total: 4,
          },
        },
      },
      fetching: { value: false },
      error: { value: null } as Ref<NuxtError<unknown> | null>,
    },
  }
})

vi.mock('@scayle/storefront-nuxt', () => ({
  extendPromise: vi.fn((_, value) => value),
}))

vi.mock('#storefront/composables', () => ({
  useProducts: vi.fn().mockReturnValue(mocks.useProducts),
}))

vi.mock('#app/composables/router', () => ({
  useRoute: vi.fn().mockReturnValue(mocks.route),
}))

vi.mock('~/composables', () => ({
  useProductListSort: vi
    .fn()
    .mockReturnValue({ selectedSort: mocks.selectedSort }),
  useAppliedFilters: vi
    .fn()
    .mockReturnValue({ appliedFilter: mocks.appliedFilter }),
}))

describe('useProductsSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('totalProductsCount', () => {
    it('should return products total', () => {
      mocks.useProducts.data.value.pagination = {
        current: 8,
        first: 1,
        last: 1,
        next: 1,
        page: 1,
        perPage: 2,
        prev: 1,
        total: 8,
      }
      const { totalProductsCount } = useProductsSearch()
      expect(totalProductsCount.value).toEqual(8)
    })
  })

  describe('paginationOffset', () => {
    it('should return pagination offset', () => {
      mocks.useProducts.data.value.pagination = {
        current: 4,
        first: 1,
        last: 1,
        next: 1,
        page: 1,
        perPage: 2,
        prev: 1,
        total: 4,
      }

      const { paginationOffset } = useProductsSearch()

      expect(paginationOffset.value).toEqual(0)
    })
  })

  describe('products', () => {
    it('should return products if they exist', () => {
      mocks.useProducts.data.value.products = [
        { id: 1, ...getProductData() },
        { id: 2, ...getProductData() },
        { id: 3, ...getProductData() },
        { id: 4, ...getProductData() },
      ]

      const { products } = useProductsSearch()
      expect(products.value.map(({ id }) => id)).toEqual([1, 2, 3, 4])
    })

    it('should return any empty products if there is no products', () => {
      mocks.useProducts.data.value.products = []

      const { products } = useProductsSearch()
      expect(products.value.length).toEqual(0)
    })
  })

  describe('pagination', () => {
    it('should return products pagination object', () => {
      mocks.useProducts.data.value.pagination = {
        current: 4,
        first: 1,
        last: 2,
        next: 1,
        page: 1,
        perPage: 2,
        prev: 1,
        total: 4,
      }

      const { pagination } = useProductsSearch()
      expect(pagination.value).toStrictEqual({
        current: 4,
        first: 1,
        last: 2,
        next: 1,
        page: 1,
        perPage: 2,
        prev: 1,
        total: 4,
      })
    })
  })

  describe('fetching', () => {
    it('should return "true" if fetching is in process', () => {
      mocks.useProducts.fetching.value = false
      const { fetching } = useProductsSearch()
      expect(fetching.value).toEqual(false)
    })

    it('should return "false" if fetching is done', () => {
      mocks.useProducts.fetching.value = true
      const { fetching } = useProductsSearch()
      expect(fetching.value).toEqual(true)
    })
  })

  describe('error', () => {
    it('should return "null" if there is no error', () => {
      mocks.useProducts.error.value = null
      const { error } = useProductsSearch()
      expect(error.value).toEqual(null)
    })

    it('should return Error if there is error', () => {
      mocks.useProducts.error.value = createError('bla')
      const { error } = useProductsSearch()
      expect(error.value).toBeTruthy()
    })
  })
})
