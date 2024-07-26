import { describe, it, vi, expect } from 'vitest'
import { useAppliedFilters } from './useAppliedFilters'

const mocks = vi.hoisted(() => {
  return {
    route: { query: {} },
    selectedSort: { value: '' },
  }
})

vi.mock('#app/composables/router', () => ({
  useRoute: vi.fn().mockReturnValue(mocks.route),
}))
vi.mock('~/composables', () => ({
  useProductListSort: vi
    .fn()
    .mockReturnValue({ selectedSort: mocks.selectedSort }),
}))

describe('useAppliedFilters', () => {
  it('should have correct applied filters', () => {
    mocks.route.query = {
      'filters[minPrice]': '1',
      'filters[maxPrice]': '100',
      'filters[term]': 'term',
      'filters[size]': '123,432,123',
      'filters[bool]': 'true',
      'filters[other]': '111,333',
    }
    const { appliedFilter } = useAppliedFilters()

    expect(appliedFilter.value.maxPrice).toBe(100)
    expect(appliedFilter.value.minPrice).toBe(1)
    expect(appliedFilter.value.term).toBe('term')
    expect(appliedFilter.value.attributes).toHaveLength(3)
    expect(appliedFilter.value.attributes).toStrictEqual([
      { type: 'attributes', key: 'size', values: [123, 432, 123] },
      { type: 'boolean', key: 'bool', value: true },
      { type: 'attributes', key: 'other', values: [111, 333] },
    ])
  })

  it('should have correct applied filter values', () => {
    mocks.route.query = {
      'filters[minPrice]': '1',
      'filters[maxPrice]': '100',
      'filters[term]': 'term',
      'filters[size]': '123,432,123',
      'filters[bool]': 'true',
      'filters[other]': '111,333',
      'filters[sale]': 'false',
    }
    const { appliedAttributeValues, appliedBooleanValues } = useAppliedFilters()

    expect(appliedAttributeValues.value['size']).toStrictEqual([123, 432, 123])
    expect(appliedAttributeValues.value['other']).toStrictEqual([111, 333])
    expect(appliedBooleanValues.value['bool']).toBeTruthy()
    expect(appliedBooleanValues.value['sale']).toBeFalsy()
  })

  it('should clean up invalid values', () => {
    mocks.route.query = {
      'filters[minPrice]': 'invalid',
      'filters[maxPrice]': 'invalid',
      'filters[other]': '111,333, invalid',
      'filter[invalid]': 'testValue',
    }
    const { appliedFilter } = useAppliedFilters()

    expect(appliedFilter.value).toStrictEqual({
      attributes: [{ type: 'attributes', key: 'other', values: [111, 333] }],
    })
  })

  describe('areFiltersApplied', () => {
    it('should return "true" if there are any filters applied', () => {
      mocks.route.query = {
        'filters[minPrice]': '1',
        'filters[maxPrice]': '100',
        'filters[term]': 'term',
        'filters[size]': '123,432,123',
        'filters[bool]': 'true',
        'filters[other]': '111,333',
      }
      const { areFiltersApplied } = useAppliedFilters()

      expect(areFiltersApplied.value).toEqual(true)
    })

    it('should return "false" if there are no filters applied', () => {
      mocks.route.query = {}
      const { areFiltersApplied } = useAppliedFilters()

      expect(areFiltersApplied.value).toEqual(false)
    })
  })

  describe('appliedFiltersCount', () => {
    it('should count the minPrice/maxPrice filters as one filter', () => {
      mocks.route.query = {
        'filters[minPrice]': '1',
        'filters[maxPrice]': '100',
      }
      const { appliedFiltersCount } = useAppliedFilters()

      expect(appliedFiltersCount.value).toEqual(1)
    })

    it('should count the boolean and attribute filters', () => {
      mocks.route.query = {
        'filters[size]': '123,432,123',
        'filters[bool]': 'true',
        'filters[other]': '111,333',
      }
      const { appliedFiltersCount } = useAppliedFilters()

      expect(appliedFiltersCount.value).toEqual(3)
    })

    it('should not count the term filter as applied', () => {
      mocks.route.query = {
        'filters[term]': 'Hello World',
      }
      const { appliedFiltersCount } = useAppliedFilters()

      expect(appliedFiltersCount.value).toEqual(0)
    })
  })
})
