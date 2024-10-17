import type {
  CategorySearchSuggestion,
  ProductSearchSuggestion,
} from '@scayle/storefront-nuxt'
import { describe, expect, it } from 'vitest'
import {
  getSearchFilterLabels,
  getSuggestionName,
  buildFiltersQuery,
  isCategorySuggestion,
  isProductSuggestion,
  type CategoryFilter,
} from './search'
import { productFactory } from '~/test/factories/product'
import { attributeGroupFactory } from '~/test/factories/attribute'
import { categoryFactory } from '~/test/factories/category'

describe('buildFiltersQuery', () => {
  it('should build filters queries for attribute filters', () => {
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
    const query = buildFiltersQuery(filters)
    expect(query).toEqual({
      'filters[color]': '10,13',
      'filters[size]': '39,37',
    })
  })

  it('should build filters queries for boolean filters', () => {
    const filters: CategoryFilter[] = [
      {
        type: 'boolean',
        booleanFilter: {
          slug: 'sale',
          label: 'Sale',
          value: true,
        },
      },
      {
        type: 'boolean',
        booleanFilter: {
          slug: 'isNew',
          label: 'New',
          value: true,
        },
      },
    ]
    const query = buildFiltersQuery(filters)
    expect(query).toEqual({ 'filters[sale]': 'true', 'filters[isNew]': 'true' })
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
      {
        type: 'boolean',
        booleanFilter: {
          slug: 'sale',
          label: 'Sale',
          value: true,
        },
      },
    ]

    const labels = getSearchFilterLabels(filters)
    expect(labels).toEqual(['Blau', 'Rot', 'M', 'XL', 'Sale'])
  })
})

describe('isProductSuggestion', () => {
  it('should return "true" if its product suggestion', () => {
    const productSuggestion: ProductSearchSuggestion = {
      type: 'product',
      productSuggestion: { product: productFactory.build() },
    }
    expect(isProductSuggestion(productSuggestion)).toEqual(true)
  })

  it('should return "false" if its not product suggestion', () => {
    const categorySuggestion: CategorySearchSuggestion = {
      type: 'category',
      categorySuggestion: { category: categoryFactory.build(), filters: [] },
    }
    expect(isProductSuggestion(categorySuggestion)).toEqual(false)
  })
})

describe('isCategorySuggestion', () => {
  it('should return "true" if its category suggestion', () => {
    const categorySuggestion: CategorySearchSuggestion = {
      type: 'category',
      categorySuggestion: { category: categoryFactory.build(), filters: [] },
    }

    expect(isCategorySuggestion(categorySuggestion)).toEqual(true)
  })
  it('should return "false" if its not category suggestion', () => {
    const productSuggestion: ProductSearchSuggestion = {
      type: 'product',
      productSuggestion: { product: productFactory.build() },
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
        category: categoryFactory.build({ name: 'Men' }),
        filters: [],
      },
    }
    expect(getSuggestionName(categorySuggestion)).toEqual('Men')
  })

  it('should return product name for product suggestion', () => {
    const productSuggestion: ProductSearchSuggestion = {
      type: 'product',
      productSuggestion: {
        product: productFactory.build({
          attributes: {
            name: attributeGroupFactory.build({
              key: 'name',
              values: {
                id: 20005,
                label: 'Calvin Klein Shirt',
                value: 'name',
              },
            }),
          },
        }),
      },
    }
    expect(getSuggestionName(productSuggestion)).toEqual('Calvin Klein Shirt')
  })
})
