import { describe, it, expect, vi, beforeEach } from 'vitest'
import type {
  Attributes,
  CentAmount,
  Product,
  RFC33339Date,
} from '@scayle/storefront-nuxt'
import { useProductBaseInfo } from './useProductBaseInfo'

vi.mock('#i18n', () => ({
  useI18n: vi.fn().mockReturnValue({
    t: (key: string, param: { productName: string; colors: string }) =>
      `${key}-${param.productName}-${param.colors}`,
  }),
}))
vi.mock('~/composables', () => ({
  useRouteHelpers: vi.fn().mockReturnValue({
    getProductDetailRoute: (id: number) => id,
  }),
}))

describe('useProductBaseInfo', () => {
  let attributes: Attributes
  let product: Product

  beforeEach(() => {
    attributes = {
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
      price: {
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
    } as Attributes
    product = {
      id: 1,
      attributes: attributes,
      isActive: true,
      isSoldOut: false,
      isNew: false,
      createdAt: '',
      updatedAt: '',
      images: [{ hash: 'test image' }],
      siblings: [
        {
          id: 5,
          attributes: attributes,
          isActive: true,
          isSoldOut: false,
          isNew: false,
          createdAt: '',
          updatedAt: '',
          images: [],
        },
      ],
      variants: [
        {
          id: 1,
          lowestPriorPrice: {
            withTax: 23,
            relativeDifferenceToPrice: null,
          },
          stock: { warehouseId: 1, quantity: 2 },
          createdAt: '' as RFC33339Date,
          updatedAt: '' as RFC33339Date,
          price: {
            withoutTax: 10 as CentAmount,
            withTax: 1 as CentAmount,
            tax: {
              vat: {
                amount: 2 as CentAmount,
                rate: 1,
              },
            },
            appliedReductions: [],
            currencyCode: '$',
          },
        },
        {
          id: 1,
          stock: { warehouseId: 1, quantity: 2 },
          createdAt: '' as RFC33339Date,
          updatedAt: '' as RFC33339Date,
          price: {
            withoutTax: 20 as CentAmount,
            withTax: 1 as CentAmount,
            tax: {
              vat: {
                amount: 2 as CentAmount,
                rate: 1,
              },
            },
            appliedReductions: [],
            currencyCode: '$',
          },
        },
      ],
    }
  })
  describe('brand', () => {
    it('should return the correct default value for brand', () => {
      const { brand } = useProductBaseInfo(product)

      expect(brand.value).toBe('Brand Name')
    })

    it('should return empty default value for brand', () => {
      attributes['brand'] = undefined
      const { brand } = useProductBaseInfo(product)

      expect(brand.value).toBe('')
    })
  })

  describe('name', () => {
    it('should return the correct default value for name', () => {
      const { name } = useProductBaseInfo(product)

      expect(name.value).toBe('Test Product')
    })

    it('should return empty default value for name', () => {
      attributes['name'] = undefined
      const { name } = useProductBaseInfo(product)

      expect(name.value).toBe('')
    })
  })

  describe('price', () => {
    it('should return the correct default value for price', () => {
      const { price } = useProductBaseInfo(product)

      expect(price.value).toStrictEqual({
        withoutTax: 10 as CentAmount,
        withTax: 1 as CentAmount,
        tax: {
          vat: {
            amount: 2 as CentAmount,
            rate: 1,
          },
        },
        appliedReductions: [],
        currencyCode: '$',
      })
    })

    it('should return undefined default value for price', () => {
      const { price } = useProductBaseInfo(undefined)

      expect(price.value).toBeUndefined()
    })
  })

  describe('variantWithLowestPrice', () => {
    it('should return the correct default value for variantWithLowestPrice', () => {
      const { variantWithLowestPrice } = useProductBaseInfo(product)

      expect(variantWithLowestPrice.value).toStrictEqual({
        createdAt: '',
        id: 1,
        lowestPriorPrice: {
          relativeDifferenceToPrice: null,
          withTax: 23,
        },
        price: {
          appliedReductions: [],
          currencyCode: '$',
          tax: {
            vat: {
              amount: 2,
              rate: 1,
            },
          },
          withTax: 1,
          withoutTax: 10,
        },
        stock: {
          quantity: 2,
          warehouseId: 1,
        },
        updatedAt: '',
      })
    })

    it('should return empty default value for variantWithLowestPrice', () => {
      product['variants'] = undefined
      const { variantWithLowestPrice } = useProductBaseInfo(product)

      expect(variantWithLowestPrice.value).toBeUndefined()
    })
  })

  describe('lowestPriorPrice', () => {
    it('should return the correct default value for lowestPriorPrice', () => {
      const { lowestPriorPrice } = useProductBaseInfo(product)

      expect(lowestPriorPrice.value).toStrictEqual({
        relativeDifferenceToPrice: null,
        withTax: 23,
      })
    })

    it('should return undefined default value for lowestPriorPrice', () => {
      product['variants'] = undefined
      const { variantWithLowestPrice } = useProductBaseInfo(product)

      expect(variantWithLowestPrice.value).toBeUndefined()
    })
  })

  describe('colors', () => {
    it('should return the correct default value for colors + sibling color', () => {
      const { colors } = useProductBaseInfo(product)

      expect(colors.value).toStrictEqual([
        {
          id: 6,
          label: 'Weiß',
          value: 'weiss',
        },
        {
          id: 6,
          label: 'Weiß',
          value: 'weiss',
        },
      ])
    })

    it('should return undefined default value for colors', () => {
      const { colors } = useProductBaseInfo(undefined)

      expect(colors.value).toBeUndefined()
    })
  })
  describe('image', () => {
    it('should return the correct default value for image', () => {
      const { image } = useProductBaseInfo(product)

      expect(image.value).toStrictEqual({
        hash: 'test image',
      })
    })

    it('should return the correct primary image', () => {
      product.images.push({
        hash: 'primary image',
        attributes: {
          primaryImage: {
            id: 1,
            key: 'primaryImage',
            label: 'primaryImage',
            type: 'string',
            multiSelect: false,
            values: {
              label: 'Primary Image',
              id: 101,
              value: 'primary-image',
            },
          },
        },
      })
      const { image } = useProductBaseInfo(product)

      expect(image.value).toStrictEqual({
        attributes: {
          primaryImage: {
            id: 1,
            key: 'primaryImage',
            label: 'primaryImage',
            multiSelect: false,
            type: 'string',
            values: {
              id: 101,
              label: 'Primary Image',
              value: 'primary-image',
            },
          },
        },
        hash: 'primary image',
      })
    })

    it('should return undefined default value for image', () => {
      const { image } = useProductBaseInfo(undefined)

      expect(image.value).toBeUndefined()
    })
  })

  describe('siblings', () => {
    it('should return the correct default value for siblings', () => {
      const { siblings } = useProductBaseInfo(product)

      expect(siblings.value).toStrictEqual([
        {
          colors: [
            {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          ],
          id: 1,
          image: {
            hash: 'test image',
          },
          name: 'Test Product',
          isSoldOut: false,
        },
        {
          colors: [
            {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          ],
          id: 5,
          image: undefined,
          name: 'Test Product',
          isSoldOut: false,
        },
      ])
    })

    it('should return the correct default value for siblings sorted by sold out state', () => {
      product.siblings?.unshift({
        id: 52,
        attributes: attributes,
        isActive: true,
        isSoldOut: true,
        isNew: false,
        createdAt: '',
        updatedAt: '',
        images: [],
      })
      const { siblings } = useProductBaseInfo(product)

      expect(siblings.value).toStrictEqual([
        {
          colors: [
            {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          ],
          id: 1,
          image: {
            hash: 'test image',
          },
          name: 'Test Product',
          isSoldOut: false,
        },
        {
          colors: [
            {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          ],
          id: 5,
          image: undefined,
          name: 'Test Product',
          isSoldOut: false,
        },
        {
          colors: [
            {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          ],
          id: 52,
          image: undefined,
          isSoldOut: true,
          name: 'Test Product',
        },
      ])
    })

    it('should return the non sold out sibling', () => {
      product.siblings?.push({
        id: 52,
        attributes: attributes,
        isActive: false,
        isSoldOut: true,
        isNew: false,
        createdAt: '',
        updatedAt: '',
        images: [],
      })
      const { nonSoldOutSiblings } = useProductBaseInfo(product)

      expect(nonSoldOutSiblings.value).toStrictEqual([
        {
          colors: [
            {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          ],
          id: 1,
          image: {
            hash: 'test image',
          },
          name: 'Test Product',
          isSoldOut: false,
        },
        {
          colors: [
            {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          ],
          id: 5,
          image: undefined,
          name: 'Test Product',
          isSoldOut: false,
        },
      ])
    })

    it('should return undefined default value for colors', () => {
      const { siblings } = useProductBaseInfo(undefined)

      expect(siblings.value).toStrictEqual([])
    })
  })

  describe('link', () => {
    it('should return the correct default value for link', () => {
      const { link } = useProductBaseInfo(product)

      expect(link.value).toBe(1)
    })

    it('should return the undefined value for link', () => {
      const { link } = useProductBaseInfo(undefined)

      expect(link.value).toBeUndefined()
    })
  })
  describe('alt', () => {
    it('should return the correct default value for alt', () => {
      const { alt } = useProductBaseInfo(product)

      expect(alt.value).toBe('product_image.alt-Test Product-Weiß & Weiß')
    })
  })

  describe('longestCategoryList', () => {
    const category1 = {
      categoryId: 1,
      categoryName: '1',
      categoryUrl: '/1',
    }
    const category2 = {
      categoryId: 2,
      categoryName: '2',
      categoryUrl: '/2',
    }
    const category3 = {
      categoryId: 2,
      categoryName: '3',
      categoryUrl: '/3',
    }
    const product = {
      id: 1,
      isActive: true,
      isSoldOut: false,
      isNew: false,
      createdAt: '2022-04-26T15:04:56+00:00',
      updatedAt: '2022-06-21T20:02:33+00:00',
      masterKey: 'HGO3464001000001',
      referenceKey: '1',
      attributes: {},
      images: [],
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
        [category1, category2],
        [category2],
        [category1, category3, category2],
        [category3],
      ],
    } as Product

    it('should return longest category from product', () => {
      const { longestCategoryList } = useProductBaseInfo(product)
      expect(longestCategoryList.value).toStrictEqual([
        category1,
        category3,
        category2,
      ])
    })

    it('should return empty longest category if no product', () => {
      const { longestCategoryList } = useProductBaseInfo(undefined)
      expect(longestCategoryList.value).toStrictEqual([])
    })

    it('should return empty longest category if categories are undefined', () => {
      product.categories = undefined
      const { longestCategoryList } = useProductBaseInfo(product)
      expect(longestCategoryList.value).toStrictEqual([])
    })

    it('should return empty longest category if categories are empty', () => {
      product.categories = []
      const { longestCategoryList } = useProductBaseInfo(product)
      expect(longestCategoryList.value).toStrictEqual([])
    })
  })
})
