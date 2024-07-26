import {
  extendPromise,
  type FetchProductsByCategoryParams,
  type FilterParams,
} from '@scayle/storefront-nuxt'
import { computed } from 'vue'
import { useProducts } from '#storefront/composables'
import { useProductListSort, useAppliedFilters } from '~/composables'
import { useRoute } from '#app/composables/router'
import {
  SEARCH_PRODUCTS_WITH_PARAMS,
  SEARCH_PRODUCTS_PER_PAGE,
  FETCH_PRODUCTS_CACHE_TTL,
} from '~/constants'

export function useProductsSearch({
  params: {
    includeSoldOut = true,
    includeSellableForFree = true,
    pricePromotionKey = '',
    orFiltersOperator,
    ...restParams
  } = {},
  options = {},
}: Partial<{
  params: Partial<FetchProductsByCategoryParams>
  options: Partial<{ lazy: boolean; immediate: boolean }>
}> = {}) {
  const route = useRoute()
  const { appliedFilter } = useAppliedFilters()
  const { selectedSort } = useProductListSort()

  const productConditions = computed<FilterParams>(() => {
    const page =
      typeof route.query.page === 'string'
        ? parseInt(route.query.page, 10)
        : undefined

    return {
      where: appliedFilter.value,
      page,
      sort: selectedSort.value,
    }
  })

  const term = String(route.query.term || '')
  const productsData = useProducts({
    params: () => ({
      ...(route.query.page && { page: +route.query.page }),
      sort: selectedSort.value,
      perPage: SEARCH_PRODUCTS_PER_PAGE,
      with: SEARCH_PRODUCTS_WITH_PARAMS,
      category: '/',
      includeSoldOut,
      includeSellableForFree,
      pricePromotionKey,
      orFiltersOperator,
      cache: {
        ttl: FETCH_PRODUCTS_CACHE_TTL,
        cacheKeyPrefix: `SEARCH:${term}`,
      },
      where: {
        ...productConditions.value.where,
        term,
      },
      ...restParams,
    }),
    key: `search-products-${term}`,
    options,
  })

  const { data, fetching, error } = productsData

  const products = computed(() => data.value?.products ?? [])
  const pagination = computed(() => data.value?.pagination ?? {})

  const totalProductsCount = computed(() => pagination.value.total ?? 0)

  const paginationOffset = computed(() => {
    const page = pagination.value.page ?? 1
    const perPage = pagination.value.perPage ?? SEARCH_PRODUCTS_PER_PAGE
    return (page - 1) * perPage
  })

  return extendPromise(productsData, {
    products,
    pagination,
    error,
    fetching,
    totalProductsCount,
    paginationOffset,
  })
}
