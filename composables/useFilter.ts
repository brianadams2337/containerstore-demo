import { extendPromise } from '@scayle/storefront-nuxt'
import { computed, type MaybeRefOrGetter, readonly, ref, toValue } from 'vue'
import type { LocationQuery } from 'vue-router'
import type { RangeTuple } from '@scayle/storefront-product-listing'
import { useTrackingEvents, useToast } from '~/composables'
import { useRoute, useRouter } from '#app/composables/router'
import { useI18n } from '#i18n'
import {
  useFiltersForListing,
  getClearedFilterQueryByKey,
  createNewBoolAttributeQuery,
  createNewAttributeQuery,
  createNewPriceQuery,
  useAppliedFilters,
} from '#storefront-product-listing'

export function useFilter(
  currentCategoryId?: MaybeRefOrGetter<number | undefined>,
  options: { immediate?: boolean; keyPrefix?: string } = {},
) {
  const route = useRoute()
  const router = useRouter()
  const areFiltersCleared = ref(false)
  const areFiltersUpdated = ref(false)

  const { appliedFiltersCount, appliedFilter } = useAppliedFilters(route)

  const sort = ref(route.query.sort)

  const params = computed(() => ({
    categoryId: toValue(currentCategoryId),
    where: appliedFilter.value,
    includeSellableForFree: true,
  }))

  const filterData = useFiltersForListing({
    params,
    fetchingOptions: options,
  })

  const { trackFilterApply, trackFilterFlyout } = useTrackingEvents()
  const { t } = useI18n()

  const { show } = useToast()

  const applyAttributeFilter = async (slug: string, id: number) => {
    const filters = createNewAttributeQuery(route, appliedFilter.value, {
      slug,
      id,
    })
    trackFilterApply(slug, id.toString())
    await applyFilters(filters)
  }

  const applyBooleanFilter = async (slug: string, value: boolean) => {
    const filters = createNewBoolAttributeQuery(route, appliedFilter.value, {
      slug,
      value,
    })
    trackFilterApply(slug, value.toString())
    await applyFilters(filters)
  }

  const applyPriceFilter = async (prices: RangeTuple) => {
    const filters = createNewPriceQuery(route, appliedFilter.value, prices)
    trackFilterApply('prices', prices.join(','))
    await applyFilters(filters)
  }

  const onSlideInOpen = () => trackFilterFlyout('open', 'true')

  const onSlideInClose = () => {
    trackFilterFlyout('close', 'true')
    const isSortUpdated = sort.value !== route.query.sort

    if (areFiltersUpdated.value && isSortUpdated) {
      show(t('filter.updated_notification_all'), { type: 'SUCCESS' })
      areFiltersUpdated.value = false
      sort.value = route.query.sort
    } else if (areFiltersUpdated.value) {
      show(t('filter.updated_notification_filter'), { type: 'SUCCESS' })
      areFiltersUpdated.value = false
    } else if (isSortUpdated) {
      show(t('filter.updated_notification_sort'), { type: 'SUCCESS' })
      sort.value = route.query.sort
    }
  }

  const resetPriceFilter = async () => {
    await applyFilters(getClearedFilterQueryByKey(route, 'prices'))
  }

  const resetFilter = async (key: string) => {
    await applyFilters(getClearedFilterQueryByKey(route, key))
  }

  const resetFilters = async () => {
    await applyFilters({})
    areFiltersCleared.value = true
    areFiltersUpdated.value = false

    setTimeout(() => {
      areFiltersCleared.value = false
    }, 3000)
  }

  const applyFilters = async (filter?: LocationQuery, scrollToTop = true) => {
    if (!filter) {
      return
    }

    // Should not apply reset all filter if appliedFilter is empty
    if (!appliedFiltersCount.value && !Object.keys(filter).length) {
      return
    }
    const query = {
      sort: route.query.sort,
      term: route.query.term,
      ...filter,
    }

    if ('page' in query) {
      delete query.page
    }

    await router.push({ query })

    areFiltersUpdated.value = true

    if (scrollToTop) {
      window.scroll({ behavior: 'smooth', top: 0 })
    }
  }

  return extendPromise(filterData, {
    onSlideInOpen,
    onSlideInClose,
    applyPriceFilter,
    applyBooleanFilter,
    applyAttributeFilter,
    trackFilterFlyout,
    resetFilters,
    resetPriceFilter,
    resetFilter,
    areFiltersCleared: readonly(areFiltersCleared),
  })
}
