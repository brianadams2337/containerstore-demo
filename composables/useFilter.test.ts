import { describe, it, vi, expect, beforeEach } from 'vitest'
import { type CentAmount } from '@scayle/storefront-nuxt'
import { useFilter } from './useFilter'

const mocks = vi.hoisted(() => {
  return {
    route: { query: {} },
    router: { push: vi.fn() },
    useAppliedFilters: {
      productConditions: { value: '' },
      appliedFilter: { value: {} },
      appliedFiltersCount: { value: 0 },
    },
    useTrackingEvents: {
      trackFilterApply: vi.fn(),
      trackFilterFlyout: vi.fn(),
    },
    useFilters: { data: { value: { filters: {}, unfilteredCount: 0 } } },
    useProductListSort: { value: '' },
    useToast: { show: vi.fn() },
    useI18n: { t: vi.fn().mockImplementation((key) => key) },
  }
})

vi.mock('@scayle/storefront-nuxt', () => ({
  extendPromise: vi.fn((_, values) => values),
}))

vi.mock('#app/composables/router', () => ({
  useRoute: vi.fn().mockReturnValue(mocks.route),
  useRouter: vi.fn().mockReturnValue(mocks.router),
}))

vi.mock('#storefront/composables', () => ({
  useFilters: vi.fn().mockReturnValue(mocks.useFilters),
}))

vi.mock('#i18n', () => ({
  useI18n: vi.fn().mockReturnValue(mocks.useI18n),
}))

vi.mock('~/composables', () => ({
  useAppliedFilters: vi.fn().mockReturnValue(mocks.useAppliedFilters),
  useTrackingEvents: vi.fn().mockReturnValue(mocks.useTrackingEvents),
  useProductListSort: vi
    .fn()
    .mockReturnValue({ selectedSort: mocks.useProductListSort }),
  useToast: vi.fn().mockReturnValue(mocks.useToast),
}))

describe('useFilter', () => {
  beforeEach(() => {
    mocks.useFilters.data.value.filters = [
      {
        id: 1,
        slug: 'brand',
        name: 'Brand',
        values: [
          {
            name: 'value',
            id: 2,
            productCount: 10,
            value: 123,
          },
        ],
        type: 'attributes',
      },
      {
        id: 12,
        slug: 'sale',
        name: 'Sale',
        values: [
          {
            name: true,
            productCount: 12,
          },
          {
            name: false,
            productCount: 2,
          },
        ],
        type: 'boolean',
      },
      {
        id: 3,
        slug: 'prices',
        name: 'Prices',
        values: [
          {
            min: 10,
            max: 300,
            productCount: 30,
          },
        ],
        type: 'range',
      },
    ]
    mocks.useAppliedFilters.appliedFilter.value = { attributes: [] }
    mocks.useAppliedFilters.appliedFiltersCount.value = 0
    mocks.route.query = {}

    vi.clearAllMocks()
  })

  it('should have correct filterable values', () => {
    const { availableFilters } = useFilter()

    expect(availableFilters.value).toHaveLength(3)
    expect(availableFilters.value).toStrictEqual([
      {
        id: 1,
        name: 'Brand',
        slug: 'brand',
        type: 'attributes',
        values: [
          {
            id: 2,
            name: 'value',
            productCount: 10,
            value: 123,
          },
        ],
      },
      {
        id: 12,
        name: 'Sale',
        slug: 'sale',
        type: 'boolean',
        values: [
          {
            name: true,
            productCount: 12,
          },
          {
            name: false,
            productCount: 2,
          },
        ],
      },
      {
        id: 3,
        name: 'Prices',
        slug: 'prices',
        type: 'range',
        values: [
          {
            max: 300,
            min: 10,
            productCount: 30,
          },
        ],
      },
    ])
  })

  it('should filter our boolean filter without products', () => {
    mocks.useFilters.data.value.filters = [
      {
        id: 12,
        slug: 'sale',
        name: 'Sale',
        values: [
          {
            name: true,
            productCount: 0,
          },
          {
            name: false,
            productCount: 2,
          },
        ],
        type: 'boolean',
      },
      {
        id: 12,
        slug: 'otherBoolean',
        name: 'other',
        values: [
          {
            name: true,
            productCount: 0,
          },
          {
            name: false,
            productCount: 2,
          },
        ],
        type: 'boolean',
      },
      {
        id: 12,
        slug: 'existingBoolean',
        name: 'Existing',
        values: [
          {
            name: true,
            productCount: 12,
          },
          {
            name: false,
            productCount: 2,
          },
        ],
        type: 'boolean',
      },
    ]

    const { availableFilters } = useFilter()
    expect(availableFilters.value).toHaveLength(1)
    expect(availableFilters.value[0]).toStrictEqual({
      id: 12,
      name: 'Existing',
      slug: 'existingBoolean',
      type: 'boolean',
      values: [
        {
          name: true,
          productCount: 12,
        },
        {
          name: false,
          productCount: 2,
        },
      ],
    })
  })

  describe('applyAttributeFilter', () => {
    it('should add new filter and value to query', () => {
      mocks.useAppliedFilters.appliedFilter.value = { attributes: [] }

      const { applyAttributeFilter } = useFilter()
      applyAttributeFilter('newAttribute', 1)
      expect(mocks.router.push).toBeCalledWith({
        query: {
          'filters[newAttribute]': '1',
        },
      })
    })

    it('should add new filter and value to query and merge with existing query', () => {
      mocks.useAppliedFilters.appliedFilter.value = { attributes: [] }
      mocks.route.query = {
        'filters[otherAttributes]': '1, 2, 3',
        sort: 'asc',
        term: 'term',
      }
      const { applyAttributeFilter } = useFilter()
      applyAttributeFilter('newAttribute', 1)
      expect(mocks.router.push).toBeCalledWith({
        query: {
          'filters[newAttribute]': '1',
          'filters[otherAttributes]': '1, 2, 3',
          sort: 'asc',
          term: 'term',
        },
      })
    })

    it('should add new value to query', () => {
      mocks.useAppliedFilters.appliedFilter.value = {
        attributes: [
          { key: 'newAttribute', values: [2, 3, 4], type: 'attributes' },
        ],
      }

      const { applyAttributeFilter } = useFilter()
      applyAttributeFilter('newAttribute', 1)
      expect(mocks.router.push).toBeCalledWith({
        query: {
          'filters[newAttribute]': '2,3,4,1',
        },
      })
    })

    it('should remove existing value from query', () => {
      mocks.useAppliedFilters.appliedFilter.value = {
        attributes: [
          { key: 'newAttribute', values: [2, 3, 4], type: 'attributes' },
        ],
      }

      const { applyAttributeFilter } = useFilter()
      applyAttributeFilter('newAttribute', 2)
      expect(mocks.router.push).toBeCalledWith({
        query: {
          'filters[newAttribute]': '3,4',
        },
      })
    })

    it('should remove existing value and filter from query', () => {
      mocks.useAppliedFilters.appliedFilter.value = {
        attributes: [{ key: 'newAttribute', values: [2], type: 'attributes' }],
      }

      mocks.useAppliedFilters.appliedFiltersCount.value = 1

      const { applyAttributeFilter } = useFilter()
      applyAttributeFilter('newAttribute', 2)
      expect(mocks.router.push).toBeCalledWith({ query: {} })
    })

    it('should show toast message on filter applied and modal closed', async () => {
      mocks.useAppliedFilters.appliedFilter.value = {
        attributes: [
          { key: 'newAttribute', values: [2, 3, 4], type: 'attributes' },
        ],
      }

      const { applyAttributeFilter, onSlideInClose } = useFilter()
      await applyAttributeFilter('newAttribute', 1)
      onSlideInClose()
      expect(mocks.useToast.show).toBeCalledWith(
        'filter.updated_notification',
        { type: 'SUCCESS' },
      )
    })

    it('should not show toast message on modal closed', async () => {
      const { onSlideInClose } = useFilter()
      onSlideInClose()
      expect(mocks.useToast.show).not.toBeCalled()
    })
  })

  describe('applyBooleanFilter', () => {
    it('should add boolean filter and value to query if true', () => {
      const { applyBooleanFilter } = useFilter()
      applyBooleanFilter('newBool', true)
      expect(mocks.router.push).toBeCalledWith({
        query: {
          'filters[newBool]': 'true',
        },
      })
    })

    it('should remove boolean filter and value from query if false', () => {
      mocks.useAppliedFilters.appliedFiltersCount.value = 1
      mocks.useAppliedFilters.appliedFilter.value = {
        attributes: [{ key: 'newBool', value: true, type: 'boolean' }],
      }

      const { applyBooleanFilter } = useFilter()
      applyBooleanFilter('newBool', false)
      expect(mocks.router.push).toBeCalledWith({
        query: {},
      })
    })
  })

  describe('applyPriceFilter', () => {
    it('should apply prices correctly', () => {
      const { applyPriceFilter } = useFilter()
      applyPriceFilter([99 as CentAmount, 2345 as CentAmount])
      expect(mocks.router.push).toBeCalledWith({
        query: {
          'filters[minPrice]': '99',
          'filters[maxPrice]': '2345',
        },
      })
    })
  })

  describe('resetFilter', () => {
    it('should reset correctly', () => {
      mocks.useAppliedFilters.appliedFilter.value = {
        attributes: [
          { key: 'newAttribute', values: [1, 2, 3, 4], type: 'attributes' },
        ],
      }
      mocks.useAppliedFilters.appliedFiltersCount.value = 1
      mocks.route.query = {
        'filters[newAttribute]': [1, 2, 3, 4],
      }
      const { resetFilter } = useFilter()
      resetFilter('newAttribute')
      expect(mocks.router.push).toBeCalledWith({
        query: {},
      })
    })

    it('should not reset if slug is not applied', () => {
      const { resetFilter } = useFilter()
      resetFilter('newAttribute')
      expect(mocks.router.push).not.toBeCalledWith({
        query: {},
      })
    })
  })

  describe('resetPriceFilter', () => {
    it('should reset correctly', () => {
      mocks.useAppliedFilters.appliedFiltersCount.value = 1
      mocks.route.query = {
        'filters[minPrice]': '1',
        'filters[maxPrice]': '12',
      }
      const { resetPriceFilter } = useFilter()
      resetPriceFilter()
      expect(mocks.router.push).toBeCalledWith({
        query: {},
      })
    })

    it('should not reset if price is not applied', () => {
      const { resetPriceFilter } = useFilter()
      resetPriceFilter()
      expect(mocks.router.push).not.toBeCalledWith({
        query: {},
      })
    })
  })

  describe('resetFilters', () => {
    it('should reset all correctly', () => {
      mocks.useAppliedFilters.appliedFiltersCount.value = 3
      mocks.route.query = {
        'filters[minPrice]': '1',
        'filters[maxPrice]': '12',
        'filters[attribute]': '[1,2,3,4,]',
        'filters[sale]': true,
      }
      const { resetFilters } = useFilter()
      resetFilters()
      expect(mocks.router.push).toBeCalledWith({
        query: {},
      })
    })

    it('should not reset if no filter is not applied', () => {
      const { resetFilters } = useFilter()
      resetFilters()
      expect(mocks.router.push).not.toBeCalledWith({
        query: {},
      })
    })
  })
})
