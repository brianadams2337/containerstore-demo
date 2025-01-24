import { describe, it, vi, expect, beforeEach } from 'vitest'
import { toRef } from 'vue'
import { categoryFactory } from '@scayle/storefront-nuxt/test/factories'
import { useRootCategories } from './useRootCategories'
import { createError } from '#app/composables/error'

const { useCategories } = vi.hoisted(() => {
  return {
    useCategories: vi.fn(),
  }
})

vi.mock('#storefront/composables', () => ({
  useCategories,
}))

describe('useRootCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return root categories and all categories with multiple categories', () => {
    useCategories.mockReturnValue({
      then: vi.fn(),
      data: toRef({
        categories: [
          categoryFactory.build({ id: 1 }),
          categoryFactory.build({ id: 2 }),
        ],
        activeNode: undefined,
      }),
      fetching: toRef(false),
      error: toRef(null),
    })

    const { rootCategories, error, allCategories } = useRootCategories()

    expect(rootCategories.value.map(({ id }) => id)).toEqual([1, 2])
    expect(allCategories.value.map(({ id }) => id)).toEqual([1, 2])
    expect(error.value).toBe(null)
  })

  it('should return root categories and all categories with single categories', () => {
    const category = categoryFactory.build({ id: 1 })
    useCategories.mockReturnValue({
      then: vi.fn(),
      data: toRef({
        categories: category,
        activeNode: category,
      }),
      fetching: toRef(false),
      error: toRef(null),
    })

    const { rootCategories, error, allCategories } = useRootCategories()

    expect(rootCategories.value.map(({ id }) => id)).toEqual([1])
    expect(allCategories.value.map(({ id }) => id)).toEqual([1])
    expect(error.value).toBe(null)
  })

  it('should handle empty categories data', () => {
    useCategories.mockReturnValue({
      then: vi.fn(),
      data: toRef(undefined),
      error: toRef(null),
      fetching: toRef(false),
    })

    const { rootCategories, error, allCategories } = useRootCategories()

    expect(rootCategories.value).toEqual([])
    expect(allCategories.value).toEqual([])
    expect(error.value).toBe(null)
  })

  it('should handle errors', () => {
    const mockError = createError('root categories error')

    useCategories.mockReturnValue({
      then: vi.fn(),
      data: toRef(undefined),
      error: toRef(mockError),
      fetching: toRef(false),
    })

    const { rootCategories, error, allCategories } = useRootCategories()

    expect(rootCategories.value).toEqual([])
    expect(allCategories.value).toEqual([])
    expect(error.value).toBe(mockError)
  })
})
