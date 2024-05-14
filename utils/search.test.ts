import type {
  Category,
  CategorySearchSuggestion,
  Product,
  ProductSearchSuggestion,
} from '@scayle/storefront-nuxt'
import { describe, it, expect } from 'vitest'

const getBaseCategory = (): Category => ({
  id: 2046,
  path: '/men',
  name: 'Men',
  slug: 'men',
  description: 'Men description',
  parentId: 0,
  rootlineIds: [2046],
  childrenIds: [2051, 2052, 2053],
  properties: [],
  isHidden: false,
  depth: 1,
  supportedFilter: ['color', 'size', 'brand'],
  shopLevelCustomData: {},
  countryLevelCustomData: {},
  children: [],
})

const getBaseProduct = (): Product => ({
  id: 1,
  isActive: true,
  isSoldOut: false,
  isNew: false,
  createdAt: '2022-03-24T10:47:18+00:00',
  updatedAt: '2024-02-07T08:19:23+00:00',
  masterKey: 'CAK1069004000001',
  referenceKey: 'CAK1069004000001',
  images: [
    {
      hash: 'images/cce0fde26236e20b7a7eae383f947ae7.png',
    },
    {
      hash: 'images/20b25319a9f4996f6716df883b5d10e5.png',
    },
    {
      hash: 'images/07f12f7108b266888f9a77318e1e7551.png',
    },
  ],
})

describe('groupSearchCategoryFiltersByKey', () => {
  it('should group category filter by key', () => {
    const filters: CategoryFilter[] = [
      {
        type: 'attribute',
        attributeFilter: {
          group: {
            id: 1001,
            key: 'color',
            label: 'Detail Color',
            type: '',
            multiSelect: false,
          },
          values: [
            {
              id: 10,
              value: 'blau',
              label: 'Blau',
            },
            {
              id: 13,
              value: 'rot',
              label: 'Rot',
            },
          ],
        },
      },
      {
        type: 'attribute',
        attributeFilter: {
          group: {
            id: 1002,
            key: 'size',
            label: 'Size',
            type: '',
            multiSelect: false,
          },
          values: [
            {
              id: 39,
              value: 'm',
              label: 'M',
            },
            {
              id: 37,
              value: 'xl',
              label: 'XL',
            },
          ],
        },
      },
    ]
    const groupedFiltersByKey = groupSearchCategoryFiltersByKey(filters)
    expect(groupedFiltersByKey).toEqual({ color: [10, 13], size: [39, 37] })
  })
})

describe('getSearchFilterLabels', () => {
  it('should return search filter labels', () => {
    const filters: CategoryFilter[] = [
      {
        type: 'attribute',
        attributeFilter: {
          group: {
            id: 1001,
            key: 'color',
            label: 'Detail Color',
            type: '',
            multiSelect: false,
          },
          values: [
            {
              id: 10,
              value: 'blau',
              label: 'Blau',
            },
            {
              id: 13,
              value: 'rot',
              label: 'Rot',
            },
          ],
        },
      },
      {
        type: 'attribute',
        attributeFilter: {
          group: {
            id: 1002,
            key: 'size',
            label: 'Size',
            type: '',
            multiSelect: false,
          },
          values: [
            {
              id: 39,
              value: 'm',
              label: 'M',
            },
            {
              id: 37,
              value: 'xl',
              label: 'XL',
            },
          ],
        },
      },
    ]

    const labels = getSearchFilterLabels(filters)
    expect(labels).toEqual(['Blau', 'Rot', 'M', 'XL'])
  })
})

describe('isProductSuggestion', () => {
  it('should return "true" if its product suggestion', () => {
    const productSuggestion: ProductSearchSuggestion = {
      type: 'product',
      productSuggestion: { product: getBaseProduct() },
    }
    expect(isProductSuggestion(productSuggestion)).toEqual(true)
  })

  it('should return "false" if its not product suggestion', () => {
    const categorySuggestion: CategorySearchSuggestion = {
      type: 'category',
      categorySuggestion: { category: getBaseCategory(), filters: [] },
    }
    expect(isProductSuggestion(categorySuggestion)).toEqual(false)
  })
})

describe('isCategorySuggestion', () => {
  it('should return "true" if its category suggestion', () => {
    const categorySuggestion: CategorySearchSuggestion = {
      type: 'category',
      categorySuggestion: { category: getBaseCategory(), filters: [] },
    }

    expect(isCategorySuggestion(categorySuggestion)).toEqual(true)
  })
  it('should return "false" if its not category suggestion', () => {
    const productSuggestion: ProductSearchSuggestion = {
      type: 'product',
      productSuggestion: { product: getBaseProduct() },
    }
    expect(isCategorySuggestion(productSuggestion)).toEqual(false)
  })
})

describe('getSuggestionName', () => {
  it('should return "undefined" if no suggestion type', () => {
    expect(getSuggestionName({ type: undefined })).toEqual(undefined)
  })

  it('should return category name for category suggestion', () => {
    const categorySuggestion: CategorySearchSuggestion = {
      type: 'category',
      categorySuggestion: {
        category: { ...getBaseCategory(), name: 'Men' },
        filters: [],
      },
    }
    expect(getSuggestionName(categorySuggestion)).toEqual('Men')
  })

  it('should return product name for product suggestion', () => {
    const productSuggestion: ProductSearchSuggestion = {
      type: 'product',
      productSuggestion: {
        product: {
          ...getBaseProduct(),
          attributes: {
            name: {
              id: 20005,
              key: 'name',
              label: 'Name',
              multiSelect: false,
              type: '',
              values: {
                id: 20005,
                label: 'Calvin Klein Shirt',
                value: 'name',
              },
            },
          },
        },
      },
    }
    expect(getSuggestionName(productSuggestion)).toEqual('Calvin Klein Shirt')
  })
})
