import {
  type CategorySearchSuggestion,
  type Product,
  type SearchEntity,
  slugify,
  serializeFilters,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'
import type { RouteLocationRaw, RouteParams } from '#vue-router'
import type { NavigateToOptions } from '#app/composables/router'
import { isString } from 'radash'

export function useRouteHelpers() {
  const localePath = useLocalePath()
  const currentShop = useCurrentShop()

  const localizedNavigateTo = (
    route: RouteLocationRaw,
    options?: NavigateToOptions,
  ) => {
    return navigateTo(getLocalizedRoute(route), options)
  }

  const getProductDetailRoute = (
    product: Product,
    id?: number,
  ): RouteLocationRaw => {
    const name = getFirstAttributeValue(product.attributes, 'name')?.label
    return localePath({
      name: 'p-slug',
      params: {
        slug: `${slugify(name)}-${id || product.id}`,
      },
    })
  }

  const getOrderProductDetailRoute = (
    product: OrderProduct,
    id?: number,
  ): RouteLocationRaw => {
    const name = product.attributes.name.label
    return localePath({
      name: 'p-slug',
      params: {
        slug: `${slugify(name)}-${id || product.id}`,
      },
    })
  }

  const getProductDetailPath = (product: Product, id?: number) => {
    const name = getFirstAttributeValue(product.attributes, 'name')?.label
    return localePath(`/p/${slugify(name)}-${id || product.id}`)
  }

  const getSearchRoute = (term: string): RouteLocationRaw => {
    return localePath({
      name: 'search',
      query: { term },
    })
  }

  const buildCategorySuggestionRoute = ({
    categorySuggestion,
  }: CategorySearchSuggestion) => {
    const { category, filters } = categorySuggestion
    const query = filters.length
      ? serializeFilters(groupSearchCategoryFiltersByKey(filters))
      : undefined
    return { path: category.path, ...(query && { query }) }
  }

  const getSearchSuggestionPath = (suggestion: SearchEntity) => {
    if (!suggestion?.type) {
      return
    }

    if (isProductSuggestion(suggestion)) {
      return getProductDetailPath(suggestion.productSuggestion.product)
    }

    if (isCategorySuggestion(suggestion)) {
      const route = buildCategorySuggestionRoute(suggestion)
      return localePath(route)
    }
  }

  const getOrderDetailsRoute = (id: number): RouteLocationRaw => {
    return localePath({
      name: routeList.orderDetail.name,
      params: { id },
    })
  }

  const getLocalizedRoute = (route: RouteLocationRaw) => {
    if (!isString(route)) {
      const isLocalePath =
        'path' in route &&
        route.path !== undefined &&
        hasLocalePrefix(route.path, currentShop.value?.path)

      return isLocalePath ? route : localePath(route)
    }

    const normalizedPath = normalizePathRoute(route)

    return hasLocalePrefix(normalizedPath, currentShop.value?.path)
      ? normalizedPath
      : localePath(normalizedPath)
  }

  const getCategoryPath = ({ category }: RouteParams): string => {
    if (!category) {
      return '/'
    }
    const path = Array.isArray(category) ? category.join('/') : category
    return normalizePathRoute(path)
  }

  return {
    localizedNavigateTo,
    getProductDetailRoute,
    getOrderProductDetailRoute,
    getSearchRoute,
    getSearchSuggestionPath,
    getOrderDetailsRoute,
    getLocalizedRoute,
    buildCategorySuggestionRoute,
    getCategoryPath,
  }
}
