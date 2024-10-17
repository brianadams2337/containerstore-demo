import type { Category } from '@scayle/storefront-nuxt'
import { it, describe } from 'vitest'
import {
  getCategoryAncestors,
  isSaleCategory,
  flattenCategoryTree,
} from './category'
import { categoryFactory } from '~/test/factories/category'

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
    const category2045 = categoryFactory.build({ id: 2045 })
    const category2048 = categoryFactory.build({
      id: 2048,
      parent: category2045,
    })
    const category1 = categoryFactory.build({ id: 1, parent: category2048 })

    const ancestors = getCategoryAncestors(category1)
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
    const category = categoryFactory.build({
      properties: [{ name: 'sale', value: 'Sale' }],
    })
    expect(isSaleCategory(category)).toEqual(true)
  })

  it('returns "false" if category is not sale', ({ expect }) => {
    const category = categoryFactory.build({
      properties: [{ name: 'featured', value: 'Featured' }],
    })
    expect(isSaleCategory(category)).toEqual(false)
  })
})

describe('flattenCategoryTree', () => {
  it('returns flattened category tree', ({ expect }) => {
    const categoryTree = [
      categoryFactory.build({
        id: 1,
        children: [
          categoryFactory.build({ id: 2 }),
          categoryFactory.build({
            id: 3,
            children: [categoryFactory.build({ id: 4 })],
          }),
        ],
      }),
      categoryFactory.build({ id: 4 }),
    ]
    const allCategories = flattenCategoryTree(categoryTree).map(
      (item) => item.id,
    )

    expect(allCategories).toEqual([1, 2, 3, 4])
  })

  it('returns flattened and unique category tree', ({ expect }) => {
    const categoryTree = [
      categoryFactory.build({
        id: 1,
        children: [
          categoryFactory.build({ id: 2 }),
          categoryFactory.build({
            id: 3,
            children: [categoryFactory.build({ id: 4 })],
          }),
        ],
      }),
      categoryFactory.build({ id: 4 }),
      categoryFactory.build({ id: 4 }),
      categoryFactory.build({ id: 1 }),
    ]

    const allCategories = flattenCategoryTree(categoryTree).map(
      (item) => item.id,
    )

    expect(allCategories).toEqual([1, 2, 3, 4])
  })
})
