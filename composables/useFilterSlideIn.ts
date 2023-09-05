import {
  CentAmount,
  ProductFilter,
  TransformedFilter,
  getActiveFilters,
  getFilterablePriceValue,
  getGroupedFilterableValues,
  groupFiltersByKey,
  transformMinAndMaxPriceToFilter,
  transformStateToFilters,
} from '@scayle/storefront-nuxt'

export interface FilterState {
  brand: []
  size: []
  color: []
  prices: [CentAmount, CentAmount]
  sale: boolean
}

interface Options {
  filterableValues: Ref<ProductFilter[]>
  activeFilters: Ref<Record<string, any>>
  supportedFilters?: string[]
  onStateChange?: (newFilterState: FilterState) => void
  onFilterApply?: (newFilterState: FilterState) => void
  onFilterReset?: () => void
}
const useFilterSlideIn = (
  {
    filterableValues,
    activeFilters,
    supportedFilters = ['brand', 'size', 'color', 'prices', 'sale'],
    onFilterApply,
    onFilterReset,
    onStateChange,
  }: Options,
  key = 'filter',
) => {
  const { toggle } = useSlideIn('FilterSlideIn')
  // const { trackFilterFlyout } = useTrackingEvents()
  const trackFilterFlyout = (..._args: any) => {}

  const availableFilterValues = computed(
    () =>
      // TODO fix in core
      getGroupedFilterableValues(
        supportedFilters,
        filterableValues.value,
      ) as Record<string, TransformedFilter[]>,
  )

  const minPrice = computed(() =>
    getFilterablePriceValue(availableFilterValues.value, 'min'),
  )

  const maxPrice = computed(() =>
    getFilterablePriceValue(availableFilterValues.value, 'max'),
  )

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
        parseInt(activeFilters.value.minPrice) as CentAmount,
        parseInt(activeFilters.value.maxPrice) as CentAmount,
      )
    } else {
      state.value.prices = [minPrice.value, maxPrice.value]
    }
  }

  const priceChanged = computed(
    () => !isEqual(initialState.value.prices, state.value.prices),
  )

  const applyFilters = () => {
    emitFilterEvent('filter:apply')
    toggle()
  }

  const debouncedStateChangedEvent = useDebounce(
    () => emitFilterEvent('filter:state-changed'),
    50,
  )

  watch(state, () => {
    debouncedStateChangedEvent()
  })

  const emitFilterEvent = (event: 'filter:apply' | 'filter:state-changed') => {
    if (event === 'filter:apply' && onFilterApply) {
      onFilterApply({
        ...transformStateToFilters(useOmit(state.value, ['prices', 'sale'])),
        ...(priceChanged.value &&
          transformMinAndMaxPriceToFilter(state.value.prices)),
        ...(state.value.sale && { sale: true }),
      })
    } else if (event === 'filter:state-changed' && onStateChange) {
      onStateChange({
        ...transformStateToFilters(useOmit(state.value, ['prices', 'sale'])),
        ...(priceChanged.value &&
          transformMinAndMaxPriceToFilter(state.value.prices)),
        ...(state.value.sale && { sale: true }),
      })
    }
  }

  const resetFilter = (key: keyof FilterState) => {
    // @ts-ignore
    state[key] = [...initialState.value[key]]
  }

  const resetFilters = () => {
    Object.assign(state, useClone(initialState.value))
    onFilterReset()
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
  return {
    onSlideInOpen,
    trackFilterFlyout,

    resetFilter,
    resetFilters,
    applyFilters,

    state,
    availableFilterValues,

    locale,
    currencyCode,
    hasPriceRange,
    priceChanged,
    minPrice,
    maxPrice,

    isSaleActive,
  }
}

export default useFilterSlideIn
