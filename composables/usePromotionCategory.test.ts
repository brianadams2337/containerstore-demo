import { vi, describe, it, expect } from 'vitest'
import { categoryFactory } from '@scayle/storefront-nuxt/test/factories'
import { usePromotionCategory } from './usePromotionCategory'

const mocks = vi.hoisted(() => {
  return {
    useCategoryById: {
      then: vi.fn(),
      data: {
        value: {},
      },
    },
  }
})

vi.mock('#storefront/composables', () => ({
  useCategoryById: vi.fn().mockReturnValue(mocks.useCategoryById),
}))

describe('usePromotionCategory', () => {
  it('returns current category for each page', () => {
    const categoryId = 1
    mocks.useCategoryById.data.value = categoryFactory.build({
      id: categoryId,
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
    const currentCategory = usePromotionCategory(categoryId)

    expect(currentCategory.data.value).toStrictEqual({
      id: categoryId,
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
  })
})
