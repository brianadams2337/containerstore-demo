/* eslint-disable sonarjs/no-duplicate-string */
import { describe, vi, it, expect } from 'vitest'
import type { Category, ProductCategory } from '@scayle/storefront-nuxt'
import { useBreadcrumbs } from './useBreadcrumbs'

const getBaseCategoryData = (): Omit<Category, 'id' | 'path' | 'name'> => ({
  slug: 'test',
  parentId: 2048,
  rootlineIds: [2045, 2048, 2058],
  childrenIds: [],
  properties: [],
  isHidden: false,
  depth: 3,
  supportedFilter: ['color', 'brand', 'size'],
  shopLevelCustomData: {},
  countryLevelCustomData: {},
})

vi.mock('~/composables', () => ({
  useRouteHelpers: vi.fn().mockReturnValue({
    buildCategoryPath: ({
      id,
      path,
    }: Category | { id: number; path: string }) => `/de/c${path}-${id}`,
  }),
}))

describe('useBreadcumbs', () => {
  describe('getBreadcrumbsFromCategory', () => {
    it('should return category breadcrumbs without active category breadcrumb', () => {
      const category: Category = {
        id: 1,
        path: '/women',
        name: 'women',
        ...getBaseCategoryData(),
        parent: {
          id: 2048,
          path: '/women/clothing',
          name: 'clothing',

          ...getBaseCategoryData(),
          parent: {
            id: 2045,
            path: '/women/clothing/shirts',
            name: 'shirts',

            ...getBaseCategoryData(),
          },
        },
      }
      const { getBreadcrumbsFromCategory } = useBreadcrumbs()

      const breadcrumbs = getBreadcrumbsFromCategory(category)

      expect(breadcrumbs).toStrictEqual([
        { to: '/de/c/women/clothing/shirts-2045', value: 'shirts' },
        { to: '/de/c/women/clothing-2048', value: 'clothing' },
      ])
    })

    it('should return category breadcrumbs with active category breadcrumb', () => {
      const category: Category = {
        id: 1,
        path: '/women',
        name: 'women',
        ...getBaseCategoryData(),
        parent: {
          id: 2048,
          path: '/women/clothing',
          name: 'clothing',

          ...getBaseCategoryData(),
          parent: {
            id: 2045,
            path: '/women/clothing/shirts',
            name: 'shirts',

            ...getBaseCategoryData(),
          },
        },
      }
      const { getBreadcrumbsFromCategory } = useBreadcrumbs()

      const breadcrumbs = getBreadcrumbsFromCategory(category, true)

      expect(breadcrumbs).toStrictEqual([
        { to: '/de/c/women/clothing/shirts-2045', value: 'shirts' },
        { to: '/de/c/women/clothing-2048', value: 'clothing' },
        { to: '/de/c/women-1', value: 'women' },
      ])
    })
  })

  describe('getBreadcrumbsFromProductCategories', () => {
    it('should return product categories breadcrumbs', () => {
      const categories: ProductCategory[] = [
        {
          categoryId: 1,
          categoryUrl: '/women',
          categoryName: 'women',
        },
        {
          categoryId: 2048,
          categoryUrl: '/women/clothing',
          categoryName: 'clothing',
        },
        {
          categoryId: 2045,
          categoryUrl: '/women/clothing/shirts',
          categoryName: 'shirts',
        },
      ]
      const { getBreadcrumbsFromProductCategories } = useBreadcrumbs()

      const breadcrumbs = getBreadcrumbsFromProductCategories(categories)

      expect(breadcrumbs).toStrictEqual([
        { to: '/de/c/women-1', value: 'women' },
        { to: '/de/c/women/clothing-2048', value: 'clothing' },
        { to: '/de/c/women/clothing/shirts-2045', value: 'shirts' },
      ])
    })
  })

  describe('getBreadcrumb', () => {
    it('should return single category breadcrumb', () => {
      const category: Category = {
        id: 1,
        path: '/women',
        name: 'women',
        ...getBaseCategoryData(),
      }
      const { getBreadcrumb } = useBreadcrumbs()

      expect(getBreadcrumb(category)).toStrictEqual({
        to: '/de/c/women-1',
        value: 'women',
      })
    })
  })
})
