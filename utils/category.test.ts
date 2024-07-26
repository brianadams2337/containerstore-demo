import type { Category } from '@scayle/storefront-nuxt'
import { it, describe } from 'vitest'
import {
  getCategoryAncestors,
  isSaleCategory,
  flattenCategoryTree,
} from './category'

const getBaseCategoryData = (): Omit<Category, 'id'> => ({
  path: '/root/child/test',
  name: 'Test',
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

describe('getCategoryAncestors', () => {
  it('returns the correct ancestors for a given category', ({ expect }) => {
    const category: Category = {
      id: 1,
      ...getBaseCategoryData(),
      parent: {
        id: 2048,
        ...getBaseCategoryData(),
        parent: {
          id: 2045,
          ...getBaseCategoryData(),
        },
      },
    }
    const ancestors = getCategoryAncestors(category)
    const ancestorIds = ancestors.map((it) => it.id)
    expect(ancestorIds).toEqual([2045, 2048])
  })

  it('returns an empty array if category does not have ancestors', ({
    expect,
  }) => {
    const result = getCategoryAncestors({
      id: 1,
      ...getBaseCategoryData(),
      parent: undefined,
    })
    expect(result).toEqual([])
  })
})

describe('isSaleCategory', () => {
  it('returns "true" if category is sale', ({ expect }) => {
    const category: Category = {
      id: 1,
      ...getBaseCategoryData(),
      properties: [{ name: 'sale', value: 'Sale' }],
    }
    expect(isSaleCategory(category)).toEqual(true)
  })

  it('returns "false" if category is not sale', ({ expect }) => {
    const category: Category = {
      id: 1,
      ...getBaseCategoryData(),
      properties: [{ name: 'featured', value: 'Featured' }],
    }
    expect(isSaleCategory(category)).toEqual(false)
  })
})

describe('flattenCategoryTree', () => {
  it('returns flattened category tree', ({ expect }) => {
    const categories: Category[] = [
      {
        id: 1,
        ...getBaseCategoryData(),
        children: [
          { id: 2, ...getBaseCategoryData() },
          {
            id: 3,
            ...getBaseCategoryData(),
            children: [{ id: 4, ...getBaseCategoryData() }],
          },
        ],
      },
      { id: 4, ...getBaseCategoryData() },
    ]

    const allCategories = flattenCategoryTree(categories).map((item) => item.id)
    expect(allCategories).toEqual([1, 2, 3, 4])
  })
})
