import { extendPromise } from '@scayle/storefront-nuxt'
import { computed, type MaybeRefOrGetter, toValue, ref } from 'vue'
import type { LocationQuery } from 'vue-router'
import { useRoute, useRouter } from '#app/composables/router'
import { useTrackingEvents, useAppliedFilters, useToast } from '~/composables'
import { useFilters } from '#storefront/composables'
import type { FilterItemWithValues } from '~/types/filter'
import type { RangeTuple } from '#storefront-ui/components/form/RangeSlider.vue'
import { useI18n } from '#i18n'

export function useFilter(
  currentCategoryId?: MaybeRefOrGetter<number | undefined>,
  options: { immediate?: boolean; keyPrefix?: string } = {},
) {
  const route = useRoute()
  const router = useRouter()
  const areFiltersUpdated = ref(false)
  const areFiltersCleared = ref(false)

  const { immediate = true, keyPrefix = 'search' } = options

  const { appliedFilter, appliedFiltersCount } = useAppliedFilters()
  const { trackFilterApply, trackFilterFlyout } = useTrackingEvents()
  const { t } = useI18n()

  const { show } = useToast()

  const filterData = useFilters({
    params: computed(() => ({
      categoryId: toValue(currentCategoryId),
      where: {
        ...appliedFilter.value,
        ...(route.query.term && { term: String(route.query.term) }),
      },
    })),
    options: { immediate },
    key: `${toValue(currentCategoryId) ?? keyPrefix}-filters`,
  })

  const {
    data,
    fetch: fetchFilters,
    fetching: filtersFetching,
    status: filterStatus,
  } = filterData

  const availableFilters = computed<FilterItemWithValues[]>(
    () =>
      data.value?.filters.filter((filter) => {
        if (filter.type !== 'boolean') return true

        const trueValue = filter.values.find(
          (value) =>
            'name' in value && typeof value.name === 'boolean' && value.name,
        )

        if (!trueValue) return false

        return trueValue.productCount !== 0
      }) as FilterItemWithValues[],
  )

  const unfilteredCount = computed(() => {
    return areFiltersUpdated.value ? data.value?.unfilteredCount : 0
  })

  const createNewAttributeQuery = (slug: string, id: number): LocationQuery => {
    const attributeFilterQuery: LocationQuery = {}
    const query = { ...route.query }
    const attribute = appliedFilter.value.attributes?.find(
      (attribute) => attribute.key === slug,
    )

    const key = `filters[${slug}]`

    if (!attribute) {
      attributeFilterQuery[key] = `${id}`
      return { ...query, ...attributeFilterQuery }
    }

    if (attribute?.type !== 'attributes') {
      return query
    }

    const values = attribute.values

    const index = values.indexOf(id)

    if (index === -1) {
      values.push(id)
    } else {
      values.splice(index, 1)
    }

    if (values.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete query[key]
      return query
    }

    attributeFilterQuery[key] = `${values.join(',')}`

    return { ...query, ...attributeFilterQuery }
  }

  const createNewPriceQuery = (prices: RangeTuple): LocationQuery => {
    const priceFilterQuery: Record<string, string> = {}
    const query = { ...route.query }

    if (appliedFilter.value.minPrice !== prices[0]) {
      priceFilterQuery['filters[minPrice]'] = prices[0].toString()
    }

    if (appliedFilter.value.maxPrice !== prices[1]) {
      priceFilterQuery['filters[maxPrice]'] = prices[1].toString()
    }

    return { ...query, ...priceFilterQuery }
  }

  const createNewBoolAttributeQuery = (
    slug: string,
    value: boolean,
  ): LocationQuery => {
    const booleanFilterQuery: Record<string, string> = {}
    const query = { ...route.query }

    const attribute = appliedFilter.value.attributes?.find(
      (attribute) => attribute.key === slug,
    )
    const key = `filters[${slug}]`

    if (!attribute) {
      if (!value) {
        return query
      }

      booleanFilterQuery[key] = String(value)
      return { ...query, ...booleanFilterQuery }
    }

    if (attribute.type !== 'boolean') {
      return query
    }

    if (!value) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete query[key]
      return query
    }

    booleanFilterQuery[key] = String(value)
    return { ...query, ...booleanFilterQuery }
  }

  const applyAttributeFilter = async (slug: string, id: number) => {
    const filters = createNewAttributeQuery(slug, id)
    trackFilterApply(slug, id.toString())
    await applyFilters(filters)
  }

  const applyBooleanFilter = async (slug: string, value: boolean) => {
    const filters = createNewBoolAttributeQuery(slug, value)
    trackFilterApply(slug, value.toString())
    await applyFilters(filters)
  }

  const applyPriceFilter = async (prices: RangeTuple) => {
    const filters = createNewPriceQuery(prices)
    trackFilterApply('prices', prices.join(','))
    await applyFilters(filters)
  }

  const resetFilter = async (key: string) => {
    const query = { ...route.query }
    const filterKey = `filters[${key}]`

    if (!query[filterKey]) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete query[filterKey]
    await applyFilters(query)
  }

  const resetPriceFilter = async () => {
    const query = { ...route.query }

    if (!query['filters[minPrice]'] && !query['filters[maxPrice]']) {
      return
    }

    delete query['filters[minPrice]']
    delete query['filters[maxPrice]']

    await applyFilters(query)
  }

  const resetFilters = async () => {
    await applyFilters({})
    areFiltersCleared.value = true
    areFiltersUpdated.value = false

    setTimeout(() => {
      areFiltersCleared.value = false
    }, 3000)
  }

  const onSlideInOpen = () => {
    trackFilterFlyout('open', 'true')
  }

  const onSlideInClose = () => {
    trackFilterFlyout('close', 'true')

    if (areFiltersUpdated.value) {
      show(t('filter.updated_notification'), { type: 'SUCCESS' })
      areFiltersUpdated.value = false
    }
  }

  const applyFilters = async (filter: LocationQuery, scrollToTop = true) => {
    const newQuery = {
      sort: route.query.sort,
      term: route.query.term,
      ...filter,
    }

    // Should not apply reset all filter if appliedFilter is empty
    if (!appliedFiltersCount.value && !Object.keys(filter).length) {
      return
    }

    await router.push({ query: { ...newQuery } })

    areFiltersUpdated.value = true

    if (scrollToTop) window.scroll({ behavior: 'smooth', top: 0 })
  }

  return extendPromise(filterData, {
    onSlideInOpen,
    onSlideInClose,
    resetFilter,
    resetFilters,
    resetPriceFilter,
    applyAttributeFilter,
    applyPriceFilter,
    applyBooleanFilter,
    availableFilters,
    trackFilterFlyout,
    filterStatus,
    unfilteredCount,
    filtersFetching,
    fetchFilters,
    areFiltersCleared,
  })
}
