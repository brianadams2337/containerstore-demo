import {
  type CentAmount,
  type TransformedFilter,
  groupFilterableValuesByKey,
  transformToWhereCondition,
  getActiveFilters,
  getFilterablePriceValue,
  getGroupedFilterableValues,
  groupFiltersByKey,
  transformMinAndMaxPriceToFilter,
  transformStateToFilters,
} from '@scayle/storefront-nuxt'

export type FilterState = {
  brand: []
  size: []
  color: []
  prices: [CentAmount, CentAmount]
  sale: boolean
}

type Options = {
  supportedFilters?: string[]
}

export default async (
  {
    supportedFilters = ['brand', 'size', 'color', 'prices', 'sale'],
  }: Options = {},
  key = 'filter',
) => {
  const route = useRoute()

  const {
    refreshProductCount,
    filters: filterableValues,
    filterStatus,
    filtersFetching,
    unfilteredCount,
    productCountData,
  } = await useProductList()

  const availableFilterValues = computed(() => {
    // TODO fix in core
    return (
      filterableValues.value &&
      (getGroupedFilterableValues(
        supportedFilters,
        filterableValues.value,
      ) as Record<string, TransformedFilter[]>)
    )
  })

  const minPrice = computed(() => {
    return (
      availableFilterValues.value &&
      getFilterablePriceValue(availableFilterValues.value, 'min')
    )
  })

  const maxPrice = computed(() => {
    return (
      availableFilterValues.value &&
      getFilterablePriceValue(availableFilterValues.value, 'max')
    )
  })

  const hasPriceRange = computed(() => minPrice.value !== maxPrice.value)

  // initial result subset
  const initialState = useState<FilterState>(key, () => ({
    size: [],
    brand: [],
    color: [],
    prices: [minPrice.value, maxPrice.value],
    sale: false,
  }))

  // user's selected conditions
  const state = useState<FilterState>(`state-${key}`, () => ({
    ...initialState.value,
  }))

  const { toggle } = useSlideIn('FilterSlideIn')
  // const { trackFilterFlyout } = useTrackingEvents()
  const trackFilterFlyout = (..._args: any) => {}

  const { trackFilterApply } = useTrackingEvents()

  const {
    applyFilters: _applyFilter,
    activeFilters,
    productConditions,
  } = useQueryFilterState({
    defaultSort: DEFAULT_SORTING_KEY,
  })

  const applyFilter = (
    preserveAttributeFilters = false,
    quickFilters?: Record<string, any>,
  ) => {
    const attributeFilters: Record<string, any> =
      route.query.value && preserveAttributeFilters
        ? parseAndPreserveAttributeFilters()
        : {}
    const filters = quickFilters || prepareFilterData()
    const combinedFilters = { ...filters, ...attributeFilters } as Record<
      string,
      any
    >
    if (!isEmpty(combinedFilters)) {
      Object.keys(combinedFilters).forEach((key: string) => {
        const values = Array.isArray(combinedFilters[key])
          ? combinedFilters[key].join('|')
          : combinedFilters[key]
        trackFilterApply(key, values)
      })
    }

    _applyFilter(combinedFilters)
  }

  // TODO: Refactor to consolidate logic and remove non-presentation logic to helpers
  const parseAndPreserveAttributeFilters = () => {
    // Attribute filters such as color should be preserved
    const attributeFilters: Record<string, any> = {}
    const keysToExclude = quickFilters.value.map((filter) => filter.key)
    const filtersFromQueryParams = JSON.parse(
      (route.query.value as any).filters || '{}',
    )
    for (const key of Object.keys(filtersFromQueryParams)) {
      if (!keysToExclude.includes(key.toLowerCase())) {
        attributeFilters[key] = filtersFromQueryParams[key]
      }
    }
    return attributeFilters
  }

  const quickFilters = computed(() => {
    return filterableValues.value
      ? groupFilterableValuesByKey(
          filterableValues.value,
          INCLUDED_QUICK_FILTERS,
        ).filter((filter) => !!filter.count)
      : []
  })

  const setActiveFiltersInState = (filters: TransformedFilter[]) => {
    /**
     * https://aboutyou.atlassian.net/browse/SCPF-4018
     * Reset to initial state values (except price), then apply only the changes
     */
    state.value.size = []
    state.value.brand = []
    state.value.color = []
    state.value.sale = false
    const groupedActiveFilters = groupFiltersByKey(filters)

    groupedActiveFilters.forEach(([key, value]: [keyof FilterState, any]) => {
      state.value[key] =
        typeof value[0].value === 'boolean' ? value[0].value === true : value
    })
  }

  const setActivePriceRangeInState = (min: CentAmount, max: CentAmount) => {
    if (min && minPrice.value && minPrice.value !== min) {
      state.value.prices[0] = min
    }

    if (max && maxPrice.value && maxPrice.value !== max) {
      state.value.prices[1] = max
    }
  }

  const setStateFromUrlParams = () => {
    setActiveFiltersInState(
      getActiveFilters(availableFilterValues.value, activeFilters.value),
    )

    if (activeFilters.value.minPrice || activeFilters.value.maxPrice) {
      setActivePriceRangeInState(
        // TODO: fix types
        parseInt(activeFilters.value.minPrice as any) as CentAmount,
        parseInt(activeFilters.value.maxPrice as any) as CentAmount,
      )
    } else {
      state.value.prices = [minPrice.value, maxPrice.value]
    }
  }

  const priceChanged = computed(
    () => !isEqual(initialState.value.prices, state.value.prices),
  )

  const applyFilters = ({
    preserveAttributeFilters = false,
    quickFilters,
  }: {
    preserveAttributeFilters?: boolean
    quickFilters?: Record<string, any>
  } = {}) => {
    applyFilter(preserveAttributeFilters, quickFilters)
    toggle()
  }

  const debouncedStateChangedEvent = useDebounce(
    { delay: 50 },
    async () => await updateFilterCount(),
  )

  watch(state, () => debouncedStateChangedEvent(), { deep: true })

  const prepareFilterData = () => ({
    ...transformStateToFilters(useOmit(state.value, ['prices', 'sale'])),
    ...(priceChanged.value &&
      transformMinAndMaxPriceToFilter(state.value.prices)),
    ...(state.value.sale && { sale: true }),
  })

  const resetFilter = (key: keyof FilterState) => {
    // @ts-ignore
    state.value[key] = [...initialState.value[key]]
  }

  const resetFilters = () => {
    Object.assign(state.value, deepClone(initialState.value))
    applyFilter()
  }

  const currentShop = useCurrentShop()

  const locale = currentShop.value!.locale?.replace('_', '-')
  const currencyCode = currentShop.value!.currency

  const isSaleActive = computed(
    () =>
      (availableFilterValues.value.sale || []).length &&
      !!availableFilterValues.value.sale[0].count,
  )

  const onSlideInOpen = () => {
    setStateFromUrlParams()
    trackFilterFlyout('open', 'true')
  }

  const updateFilterCount = async () => {
    const filters = prepareFilterData()
    await refreshProductCount({ where: transformToWhereCondition(filters) })
  }

  const isFiltered = computed(() => {
    return !!productConditions.value.where?.attributes?.length
  })

  const filteredCount = computed(() => productCountData.value?.count || 0)

  return {
    onSlideInOpen,
    resetFilter,
    resetFilters,
    applyFilters,
    state,
    locale,
    currencyCode,
    hasPriceRange,
    priceChanged,
    minPrice,
    maxPrice,
    isSaleActive,
    quickFilters,
    activeFilters,
    availableFilterValues,
    filterableValues,
    trackFilterFlyout,
    isFiltered,
    filterStatus,
    unfilteredCount,
    filteredCount,
    filtersFetching,
  }
}
