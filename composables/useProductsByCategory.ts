import {
  extendPromise,
  type Category,
  type FetchProductsByCategoryParams,
} from '@scayle/storefront-nuxt'
import { type Ref, computed } from 'vue'
import { useProducts } from '#storefront/composables'
import { useProductListSort, useAppliedFilters } from '~/composables'
import { useRoute } from '#app/composables/router'
import {
  PRODUCT_WITH_PARAMS,
  PRODUCTS_PER_PAGE,
  FETCH_PRODUCTS_CACHE_TTL,
} from '~/constants'

export function useProductsByCategory(
  category: Ref<Category>,
  {
    params: {
      includeSoldOut = true,
      includeSellableForFree = true,
      pricePromotionKey = '',
      orFiltersOperator,
      ...restParams
    } = {},
    options,
  }: Partial<{
    params: Omit<
      Partial<FetchProductsByCategoryParams>,
      'category' | 'categoryId'
    >
    options: Partial<{ lazy: boolean; immediate: boolean }>
  }> = {},
) {
  const route = useRoute()
  const { selectedSort } = useProductListSort()
  const { appliedFilter } = useAppliedFilters()

  const productsData = useProducts({
    params: () => ({
      ...(route.query.page && { page: +route.query.page }),
      sort: selectedSort.value,
      perPage: Number(route.query.products_per_page) || PRODUCTS_PER_PAGE,
      with: PRODUCT_WITH_PARAMS,
      category: category.value.path,
      includeSoldOut,
      includeSellableForFree,
      pricePromotionKey,
      orFiltersOperator,
      cache: {
        ttl: FETCH_PRODUCTS_CACHE_TTL,
        cacheKeyPrefix: `PLP:${category.value.id}`,
      },
      where: appliedFilter.value,
      ...restParams,
    }),
    key: `${category.value.id}-products`,
    options,
  })

  const { data, fetching, error } = productsData

  const products = computed(() => data.value?.products ?? [])
  const pagination = computed(() => data.value?.pagination)

  const totalProductsCount = computed(() => data.value?.pagination.total ?? 0)

  const paginationOffset = computed(() => {
    const page = data.value?.pagination.page ?? 1
    const perPage = data.value?.pagination.perPage ?? PRODUCTS_PER_PAGE
    return (page - 1) * perPage
  })

  return extendPromise(
    productsData.then(() => ({})),
    {
      products,
      pagination,
      error,
      fetching,
      totalProductsCount,
      paginationOffset,
    },
  )
}
