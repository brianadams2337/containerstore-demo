import { toRef } from 'vue'
import { describe, beforeEach, it, vi, expect } from 'vitest'
import { useProductsByCategory } from './useProductsByCategory'
import { createError } from '#app/composables/error'
import { productFactory } from '~/test/factories/product'
import { categoryFactory } from '~/test/factories/category'

const { useProducts, useRoute, useProductListSort, useAppliedFilters } =
  vi.hoisted(() => {
    return {
      useProducts: vi.fn(),
      useRoute: vi.fn().mockReturnValue({ query: {} }),
      useProductListSort: vi
        .fn()
        .mockReturnValue({ selectedSort: { value: '' } }),
      useAppliedFilters: vi
        .fn()
        .mockReturnValue({ appliedFilter: { value: {} } }),
    }
  })

vi.mock('#storefront/composables', () => ({
  useProducts,
}))

vi.mock('#app/composables/router', () => ({
  useRoute,
}))

vi.mock('~/composables', () => ({
  useProductListSort,
  useAppliedFilters,
}))

describe('useProductsByCategory', () => {
  beforeEach(() => {
    useProducts.mockReset()
  })

  describe('totalProductsCount', () => {
    it('should return products total', () => {
      useProducts.mockReturnValue({
        then: vi.fn(),
        data: toRef({
          products: [
            productFactory.build({ id: 1 }),
            productFactory.build({ id: 2 }),
            productFactory.build({ id: 3 }),
            productFactory.build({ id: 4 }),
          ],
          pagination: {
            current: 4,
            first: 1,
            last: 2,
            next: 1,
            page: 1,
            perPage: 2,
            prev: 1,
            total: 8,
          },
          category: categoryFactory.build({
            id: 1,
          }),
        }),
      })
      const { totalProductsCount } = useProductsByCategory(toRef(1))
      expect(totalProductsCount.value).toEqual(8)
    })
  })

  describe('paginationOffset', () => {
    it('should return pagination offset', () => {
      useProducts.mockReturnValue({
        then: vi.fn(),
        data: toRef({
          products: [
            productFactory.build({ id: 1 }),
            productFactory.build({ id: 2 }),
            productFactory.build({ id: 3 }),
            productFactory.build({ id: 4 }),
          ],
          pagination: {
            current: 4,
            first: 1,
            last: 1,
            next: 1,
            page: 1,
            perPage: 2,
            prev: 1,
            total: 4,
          },
          category: categoryFactory.build({
            id: 1,
          }),
        }),
      })

      const { paginationOffset } = useProductsByCategory(toRef(1))

      expect(paginationOffset.value).toEqual(0)
    })
  })

  describe('products', () => {
    it('should return products if they exist', () => {
      useProducts.mockReturnValue({
        then: vi.fn(),
        data: toRef({
          products: [
            productFactory.build({ id: 1 }),
            productFactory.build({ id: 2 }),
            productFactory.build({ id: 3 }),
            productFactory.build({ id: 4 }),
          ],
          pagination: {
            current: 4,
            first: 1,
            last: 1,
            next: 1,
            page: 1,
            perPage: 2,
            prev: 1,
            total: 4,
          },
          category: categoryFactory.build({
            id: 1,
          }),
        }),
      })

      const { products } = useProductsByCategory(toRef<number>(1))
      expect(products.value.map(({ id }) => id)).toEqual([1, 2, 3, 4])
    })

    it('should return any empty products if there is no products', () => {
      useProducts.mockReturnValue({
        then: vi.fn(),
        data: toRef({
          products: [],
          pagination: {
            current: 1,
            first: 1,
            last: 1,
            next: 1,
            page: 1,
            perPage: 2,
            prev: 1,
            total: 0,
          },
          category: categoryFactory.build({
            id: 1,
          }),
        }),
      })

      const { products } = useProductsByCategory(toRef<number>(1))
      expect(products.value.length).toEqual(0)
    })
  })

  describe('pagination', () => {
    it('should return products pagination object', () => {
      useProducts.mockReturnValue({
        then: vi.fn(),
        data: toRef({
          products: [
            productFactory.build({ id: 1 }),
            productFactory.build({ id: 2 }),
            productFactory.build({ id: 3 }),
            productFactory.build({ id: 4 }),
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
          category: categoryFactory.build({
            id: 1,
          }),
        }),
      })
      const { pagination } = useProductsByCategory(toRef<number>(1))
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
      useProducts.mockReturnValue({
        then: vi.fn(),
        fetching: toRef(false),
        data: vi.fn(),
      })
      const { fetching } = useProductsByCategory(toRef(1))
      expect(fetching.value).toEqual(false)
    })

    it('should return "false" if fetching is done', () => {
      useProducts.mockReturnValue({
        then: vi.fn(),
        fetching: toRef(true),
        data: vi.fn(),
      })
      const { fetching } = useProductsByCategory(toRef(1))
      expect(fetching.value).toEqual(true)
    })
  })

  describe('error', () => {
    it('should return "null" if there is no error', () => {
      useProducts.mockReturnValue({
        error: toRef(null),
        data: vi.fn(),
        then: vi.fn(),
      })
      const { error } = useProductsByCategory(toRef(1))
      expect(error.value).toEqual(null)
    })

    it('should return Error if there is error', () => {
      useProducts.mockReturnValue({
        error: toRef(createError('products error')),
        data: vi.fn(),
        then: vi.fn(),
      })
      const { error } = useProductsByCategory(toRef(1))
      expect(error.value).toBeTruthy()
    })
  })
})
