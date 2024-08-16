import { describe, it, expect, vi } from 'vitest'
import type { Attributes, SearchEntity } from '@scayle/storefront-nuxt'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useRouteHelpers } from './useRouteHelpers'

vi.mock('#storefront/composables', () => ({
  useCurrentShop: () => ({
    value: { path: 'de' },
  }),
}))

const mockNavigateTo = vi.hoisted(() => vi.fn())

mockNuxtImport('navigateTo', () => mockNavigateTo)

describe('useRouteHelpers', () => {
  describe('localizedNavigateTo', () => {
    it('should call navigateTo with localized route', async () => {
      const { localizedNavigateTo } = useRouteHelpers()

      await localizedNavigateTo({ path: '/p/name-1' }, { replace: true })

      expect(mockNavigateTo).toBeCalledWith('/de/p/name-1', {
        replace: true,
      })
    })
  })

  describe('getProductDetailRoute', () => {
    it('should return correct product route', () => {
      const { getProductDetailRoute } = useRouteHelpers()
      const attributes = {
        name: {
          id: 1,
          key: 'name',
          label: 'Test Product',
          type: null,
          multiSelect: false,
          values: {
            label: 'Test Product',
          },
        },
      } as Attributes
      const product = {
        id: 1,
        attributes: attributes,
        isActive: true,
        isSoldOut: false,
        isNew: false,
        createdAt: '',
        updatedAt: '',
        images: [],
      }
      const productDetailRoute = getProductDetailRoute(product)
      expect(productDetailRoute).toStrictEqual('/de/p/test-product-1')
    })
  })

  describe('getOrderProductDetailRoute', () => {
    it('should return correct order product route', () => {
      const { getOrderProductDetailRoute } = useRouteHelpers()

      const orderProduct: OrderProduct = {
        advancedAttributes: {
          advColor: {
            key: 'advColor',
            label: 'Advanced Color',
            values: [
              {
                fieldSet: [[{ color: 'Red' }]],
                groupSet: [],
              },
            ],
          },
          productName: {
            key: 'productName',
            label: 'Product Name',
            values: [
              {
                fieldSet: [[{ name: 'Sample Product' }]],
                groupSet: [],
              },
            ],
          },
          // You can add more advanced attributes here if needed
        },
        attributes: {
          brand: {
            id: 1,
            key: 'brand',
            label: 'Brand',
            type: 'string',
            multiSelect: false,
            values: {
              label: 'Brand Name',
              id: 101,
              value: 'brand-name',
            },
          },
          brandLogo: {
            id: 2,
            key: 'brandLogo',
            label: 'Brand Logo',
            type: 'string',
            multiSelect: false,
            values: {
              label: 'https://example.com/brand-logo.png',
              id: 102,
              value: 'https://example.com/brand-logo.png',
            },
          },
          category: {
            id: 3,
            key: 'category',
            label: 'Category',
            type: 'string',
            multiSelect: true,
            values: [
              {
                label: 'Category 1',
                id: 201,
                value: 'category-1',
              },
              {
                label: 'Category 2',
                id: 202,
                value: 'category-2',
              },
            ],
          },
          color: {
            id: 4,
            key: 'color',
            label: 'Color',
            type: 'string',
            multiSelect: false,
            values: {
              label: 'Red',
              id: 301,
              value: 'red',
            },
          },
          colorHex: {
            id: 5,
            key: 'colorHex',
            label: 'Color Hex',
            type: 'string',
            multiSelect: false,
            values: {
              label: '#FF0000',
              id: 302,
              value: '#FF0000',
            },
          },
          description: {
            id: 6,
            key: 'description',
            label: 'Description',
            type: 'string',
            multiSelect: false,
            values: {
              label: 'This is a sample product.',
              id: 303,
              value: 'This is a sample product.',
            },
          },
          name: {
            id: 7,
            key: 'name',
            label: 'Order Product',
            type: 'string',
            multiSelect: false,
            values: {
              label: 'Order Product',
              id: 304,
              value: 'Order Product',
            },
          },
        },
        categories: [
          [
            {
              categoryHidden: false,
              categoryId: 1,
              categoryName: 'Category 1',
              categorySlug: 'category-1',
              categoryUrl: 'https://example.com/category-1',
            },
          ],
        ],
        createdAt: '2023-01-01T00:00:00+00:00',
        id: 2,
        images: [
          {
            hash: 'image-hash-1',
          },
          {
            hash: 'image-hash-2',
          },
        ],
        masterKey: 'master-key-1',
        name: 'Sample Product',
        updatedAt: '2023-01-02T00:00:00+00:00',
      }

      const orderProductDetailRoute = getOrderProductDetailRoute(orderProduct)
      expect(orderProductDetailRoute).toStrictEqual('/de/p/order-product-2')
    })
  })

  describe('getSearchRoute', () => {
    it('should return correct search route', () => {
      const { getSearchRoute } = useRouteHelpers()

      const searchRoute = getSearchRoute('test')
      expect(searchRoute).toStrictEqual('/de/search?term=test')
    })
  })

  describe('getSearchSuggestionPath', () => {
    it('should return correct product suggestion path', () => {
      const { getSearchSuggestionPath } = useRouteHelpers()
      const attributes = {
        name: {
          id: 1,
          key: 'name',
          label: 'Suggested Product',
          type: null,
          multiSelect: false,
          values: {
            label: 'Suggested Product',
          },
        },
      } as Attributes
      const product = {
        id: 1,
        attributes: attributes,
        isActive: true,
        isSoldOut: false,
        isNew: false,
        createdAt: '',
        updatedAt: '',
        images: [],
      }
      const suggestion = {
        type: 'product',
        productSuggestion: {
          product,
        },
      } as SearchEntity

      const searchSuggestionPath = getSearchSuggestionPath(suggestion)
      expect(searchSuggestionPath).toStrictEqual('/de/p/suggested-product-1')
    })

    it('should return correct category suggestion path', () => {
      const { getSearchSuggestionPath } = useRouteHelpers()
      const sampleCategorySearchSuggestion = {
        type: 'category',
        categorySuggestion: {
          category: {
            id: 1,
            path: '/category-path',
            name: 'Sample Category',
            slug: 'sample-category',
            parentId: 0,
            rootlineIds: [0, 1],
            childrenIds: [2, 3],
            properties: [
              { name: 'property1', value: 'value1' },
              { name: 'property2', value: 2 },
            ],
            isHidden: false,
            depth: 1,
            supportedFilter: ['filter1', 'filter2'],
            shopLevelCustomData: {
              customKey1: 'customValue1',
            },
            countryLevelCustomData: {
              customKey2: 'customValue2',
            },
          },
          filters: [
            {
              type: 'attribute',
              attributeFilter: {
                group: {
                  id: 1,
                  key: 'color',
                  label: 'Color',
                  type: 'string',
                  multiSelect: true,
                },
                values: [
                  { id: 1, value: 'red', label: 'Red' },
                  { id: 2, value: 'blue', label: 'Blue' },
                ],
              },
            },
            {
              type: 'boolean',
              booleanFilter: {
                slug: 'isAvailable',
                value: true,
                label: 'Available',
              },
            },
          ],
        },
      } as SearchEntity

      const searchSuggestionPath = getSearchSuggestionPath(
        sampleCategorySearchSuggestion,
      )
      expect(searchSuggestionPath).toStrictEqual(
        '/de/c/category-path-1?filters[color]=1,2&filters[isAvailable]=true',
      )
    })
  })

  describe('getOrderDetailsRoute', () => {
    it('should return correct order details route', () => {
      const { getOrderDetailsRoute } = useRouteHelpers()

      const orderDetailsRoute = getOrderDetailsRoute(123)
      expect(orderDetailsRoute).toStrictEqual('/de/account/orders/123')
    })
  })

  describe('getLocalizedRoute', () => {
    it('should return localized route if not already localized for route object', () => {
      const { getLocalizedRoute } = useRouteHelpers()

      const localizedRoute = getLocalizedRoute({ path: '/p/name-1' })
      expect(localizedRoute).toStrictEqual('/de/p/name-1')
    })

    it('should return localized route if not already localized for route string', () => {
      const { getLocalizedRoute } = useRouteHelpers()

      const localizedRoute = getLocalizedRoute('/p/name-1')
      expect(localizedRoute).toBe('/de/p/name-1')
    })

    it('should return localized route if already localized for route object', () => {
      const { getLocalizedRoute } = useRouteHelpers()

      const localizedRoute = getLocalizedRoute({
        path: '/de/p/name-1',
      })
      expect(localizedRoute).toStrictEqual({
        path: '/de/p/name-1',
      })
    })

    it('should return localized route if already localized for route string', () => {
      const { getLocalizedRoute } = useRouteHelpers()

      const localizedRoute = getLocalizedRoute('/de/p/name-1')
      expect(localizedRoute).toBe('/de/p/name-1')
    })
  })

  describe('buildCategoryPath', () => {
    it(' should return correct category path', () => {
      const { buildCategoryPath } = useRouteHelpers()

      const category = { id: 1, path: '/category-path' }
      const categoryPath = buildCategoryPath(category)
      expect(categoryPath).toBe('/de/c/category-path-1')
    })
  })
})
