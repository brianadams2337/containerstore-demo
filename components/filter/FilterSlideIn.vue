<template>
  <SlideIn
    name="FilterSlideIn"
    slide-class="mt-[112px] border-t border-l border-primary xl:inset-y-0"
    @open="
      () => {
        setStateFromUrlParams()
        trackFilterFlyout('open', 'true')
      }
    "
    @close="trackFilterFlyout('close', 'true')">
    <template #slideInHeader="{ toggle: toggleItem }">
      <div class="flex w-full items-center justify-between">
        <Headline :is-uppercase="false" size="xl" tag="p"
          >{{ $t('filter.title') }}
        </Headline>
        <AppButton
          type="ghost"
          size="xs"
          data-test-id="closeCross"
          @click="toggleItem">
          <template #icon="{ _class }">
            <IconClose :class="_class" />
          </template>
        </AppButton>
      </div>
    </template>
    <template #slideInBody>
      <div class="my-8 divide-y">
        <FilterGroup
          :badge="state.size.length"
          :label="$t('filter.size')"
          @click:reset="resetFilter('size')">
          <MultipleSelectionList
            v-model="state.size"
            :items="availableFilterValues.size"
            class="flex flex-wrap"
            name="FilterSelectSize">
            <template #item="{ item, toggleItem, isActive }">
              <AppButton
                :class="
                  isActive
                    ? 'border-[#2d2c2f] !bg-white text-primary'
                    : 'border-gray-350 text-[#5c5b5f]'
                "
                class="mb-2 mr-2 border-2 px-3 py-2 text-xs font-medium"
                type="secondary"
                no-padding
                @click="toggleItem(item)"
                >{{ item.displayName }}
              </AppButton>
            </template>
          </MultipleSelectionList>
        </FilterGroup>

        <FilterGroup
          :badge="state.brand.length"
          :label="$t('filter.brands')"
          @click:reset="resetFilter('brand')">
          <MultipleSelectionList
            v-model="state.brand"
            :items="availableFilterValues.brand"
            :limit="6"
            selected-first
            class="grid grid-cols-2 gap-3"
            name="FilterSelectBrand">
            <template #item="{ item }">
              <li class="mb-2 list-none">
                <CheckBox
                  :id="item.displayName"
                  v-model="state.brand"
                  :item="item"
                  :label="item.displayName" />
              </li>
            </template>
          </MultipleSelectionList>
        </FilterGroup>

        <FilterGroup
          :badge="state.color.length"
          :label="$t('filter.colors')"
          @click:reset="resetFilter('color')">
          <MultipleSelectionList
            v-model="state.color"
            :items="availableFilterValues.color"
            class="flex flex-wrap gap-3"
            name="FilterSelectColors">
            <template #item="{ item, toggleItem, isActive }">
              <button
                :aria-label="`select color ${item.displayName}`"
                class="appearance-none focus:outline-none"
                @click="toggleItem(item)">
                <ColorChip
                  data-test-id="filter-color-circle"
                  :color="{
                    id: item.value,
                    value: item.value,
                    label: item.displayName,
                  }"
                  class="h-5 w-5"
                  :is-active="isActive" />
              </button>
            </template>
          </MultipleSelectionList>
        </FilterGroup>

        <FilterGroup
          v-if="hasPriceRange"
          :label="$t('filter.price')"
          :show-action="
            (activeFilters.maxPrice || activeFilters.minPrice) && priceChanged
          "
          @click:reset="resetFilter('prices')">
          <RangeSlider
            v-model="state.prices"
            :max="maxPrice"
            :min="minPrice"
            :currency-code="currencyCode"
            :locale="locale" />
        </FilterGroup>

        <FilterGroup v-if="isSaleActive" :label="$t('filter.only_sale')">
          <template #action>
            <Toggle v-model="state.sale" />
          </template>
        </FilterGroup>
      </div>
    </template>

    <template #slideInActions>
      <div class="grid grid-cols-2 gap-2">
        <AppButton
          data-test-id="reset-filter-button"
          type="tertiary"
          class="text-sm !capitalize"
          @click="resetFilters"
          >{{ $t('filter.reset_all') }}
        </AppButton>
        <AppButton
          data-test-id="apply-filter-button"
          is-full-width
          type="primary"
          class="text-sm !capitalize"
          @click="applyFilters">
          {{
            filteredCount !== unfilteredCount
              ? $t('filter.show_results_count', { count: filteredCount })
              : $t('filter.show_results')
          }}
        </AppButton>
      </div>
    </template>
  </SlideIn>
</template>

<script setup lang="ts">
import {
  CentAmount,
  getActiveFilters,
  getFilterablePriceValue,
  getGroupedFilterableValues,
  groupFiltersByKey,
  ProductFilter,
  TransformedFilter,
  transformMinAndMaxPriceToFilter,
  transformStateToFilters,
} from '@scayle/storefront-nuxt'

const props = defineProps({
  filters: {
    type: Array as PropType<ProductFilter[]>,
    default: () => [],
  },
  activeFilters: {
    type: Object as PropType<Record<string, any>>,
    default: () => {},
  },
  isActiveFilter: {
    type: Function as PropType<() => boolean>,
    default: () => false,
  },
  filteredCount: {
    type: Number as PropType<number>,
    default: 0,
  },
  unfilteredCount: {
    type: Number as PropType<number>,
    default: 0,
  },
  fetchingFilteredCount: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
})

const emit = defineEmits([
  'filter:apply',
  'filter:stateChanged',
  'filter:reset',
])

const { filters: filterableValues, activeFilters } = toRefs(props)
const { toggle } = useSlideIn('FilterSlideIn')
const supportedFilters = ['brand', 'size', 'color', 'prices', 'sale']
// const { trackFilterFlyout } = useTrackingEvents()
const trackFilterFlyout = (..._args: any) => {}

interface FilterState {
  brand: []
  size: []
  color: []
  prices: [CentAmount, CentAmount]
  sale: boolean
}

const availableFilterValues = computed(() =>
  getGroupedFilterableValues(supportedFilters, filterableValues.value),
)

const minPrice = computed(() =>
  getFilterablePriceValue(availableFilterValues.value, 'min'),
)

const maxPrice = computed(() =>
  getFilterablePriceValue(availableFilterValues.value, 'max'),
)

const hasPriceRange = computed(() => minPrice.value !== maxPrice.value)

// initial result subset
const initialState = computed<FilterState>(() => ({
  size: [],
  brand: [],
  color: [],
  prices: [minPrice.value, maxPrice.value],
  sale: false,
}))

// user's selected conditions
const state = reactive(useClone(initialState.value))

const setActiveFiltersInState = (filters: TransformedFilter[]) => {
  /**
   * https://aboutyou.atlassian.net/browse/SCPF-4018
   * Reset to initial state values (except price), then apply only the changes
   */
  state.size = []
  state.brand = []
  state.color = []
  state.sale = false
  const groupedActiveFilters = groupFiltersByKey(filters)

  groupedActiveFilters.forEach(([key, value]: [keyof FilterState, any]) => {
    state[key] =
      typeof value[0].value === 'boolean' ? value[0].value === true : value
  })
}

const setActivePriceRangeInState = (min: CentAmount, max: CentAmount) => {
  if (min && minPrice.value && minPrice.value !== min) {
    state.prices[0] = min
  }

  if (max && maxPrice.value && maxPrice.value !== max) {
    state.prices[1] = max
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
    state.prices = [minPrice.value, maxPrice.value]
  }
}

const priceChanged = computed(
  () => !isEqual(initialState.value.prices, state.prices),
)

const applyFilters = () => {
  emitFilterEvent('filter:apply')
  toggle()
}

const debouncedStateChangedEvent = useDebounce(
  () => emitFilterEvent('filter:stateChanged'),
  50,
)

watch(state, () => {
  debouncedStateChangedEvent()
})

const emitFilterEvent = (event: 'filter:apply' | 'filter:stateChanged') => {
  emit(event, {
    ...transformStateToFilters(useOmit(state, ['prices', 'sale'])),
    ...(priceChanged.value && transformMinAndMaxPriceToFilter(state.prices)),
    ...(state.sale && { sale: true }),
  })
}

const resetFilter = (key: keyof FilterState) => {
  // @ts-ignore
  state[key] = [...initialState.value[key]]
}

const resetFilters = () => {
  Object.assign(state, useClone(initialState.value))
  emit('filter:reset')
}

const currentShop = useCurrentShop()

const locale = currentShop.value!.locale?.replace('_', '-')
const currencyCode = currentShop.value!.currency

const isSaleActive = computed(
  () =>
    (availableFilterValues.value.sale || []).length &&
    !!availableFilterValues.value.sale[0].count,
)
</script>
