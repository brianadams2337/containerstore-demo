import { describe, it, vi, expect } from 'vitest'
import { useProductListSort } from './useProductListSort'

const mocks = vi.hoisted(() => {
  return {
    route: { query: { sort: '' }, path: '/test' },
  }
})

vi.mock('#app/composables/router', () => ({
  useRoute: vi.fn().mockReturnValue(mocks.route),
}))

vi.mock('#i18n', () => ({
  useI18n: () => {
    return { t: vi.fn((param) => param) }
  },
}))

describe('useProductListSort', () => {
  it('should return default sorting key if sort query is empty', () => {
    const { selectedSort } = useProductListSort()
    expect(selectedSort.value.key).toBe('date_newest')
  })

  it('should return selected sorting key if sort query is set correctly', () => {
    mocks.route.query.sort = 'price_asc'
    const { selectedSort } = useProductListSort()
    expect(selectedSort.value.key).toBe('price_asc')
  })

  it('should return default sorting key if sort query has a invalid key', () => {
    mocks.route.query.sort = 'asdf'
    const { selectedSort } = useProductListSort()
    expect(selectedSort.value.key).toBe('date_newest')
  })

  it('should generate sort links correctly', () => {
    const { sortLinks } = useProductListSort()
    expect(sortLinks.value).toHaveLength(5)

    expect(sortLinks.value[0]).toStrictEqual({
      key: 'top_seller',
      by: 'price',
      direction: 'asc',
      to: { path: '/test', query: { sort: 'top_seller' } },
      label: 'sorting_select.top_seller',
    })

    expect(sortLinks.value[1]).toStrictEqual({
      key: 'date_newest',
      by: 'new',
      to: { path: '/test', query: { sort: 'date_newest' } },
      label: 'sorting_select.date_newest',
    })

    expect(sortLinks.value[2]).toStrictEqual({
      key: 'price_desc',
      by: 'price',
      direction: 'desc',
      to: { path: '/test', query: { sort: 'price_desc' } },
      label: 'sorting_select.price_desc',
    })

    expect(sortLinks.value[3]).toStrictEqual({
      key: 'price_asc',
      by: 'price',
      direction: 'asc',
      to: { path: '/test', query: { sort: 'price_asc' } },
      label: 'sorting_select.price_asc',
    })

    expect(sortLinks.value[4]).toStrictEqual({
      key: 'reduction_desc',
      by: 'reduction',
      direction: 'desc',
      to: { path: '/test', query: { sort: 'reduction_desc' } },
      label: 'sorting_select.reduction_desc',
    })
  })

  describe('isDefaultSortSelected', () => {
    it('should return "true"', () => {
      mocks.route.query.sort = 'date_newest'
      const { isDefaultSortSelected } = useProductListSort()
      expect(isDefaultSortSelected.value).toEqual(true)
    })

    it('should return "false"', () => {
      mocks.route.query.sort = 'price_desc'
      const { isDefaultSortSelected } = useProductListSort()
      expect(isDefaultSortSelected.value).toEqual(false)
    })
  })
})
