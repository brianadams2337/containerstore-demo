import {
  type Category,
  type CategorySearchSuggestion,
  type SearchEntity,
  getFirstAttributeValue,
  slugify,
} from '@scayle/storefront-nuxt'
import type { RouteLocationRaw } from '#vue-router'
import { type NavigateToOptions, navigateTo } from '#app/composables/router'
import { useCurrentShop } from '#storefront/composables'
import { useLocalePath } from '#i18n'
import {
  buildFiltersQuery,
  hasLocalePrefix,
  isCategorySuggestion,
  isProductSuggestion,
  normalizePathRoute,
  routeList,
} from '~/utils'

export function useRouteHelpers() {
  const localePath = useLocalePath()
  const currentShop = useCurrentShop()

  const localizedNavigateTo = (
    route: RouteLocationRaw,
    options?: NavigateToOptions,
  ) => {
    return navigateTo(getLocalizedRoute(route), options)
  }

  const getProductDetailRoute = (product: Product, id?: number): string => {
    const name = getFirstAttributeValue(product.attributes, 'name')?.label
    return localePath({
      name: 'p-productName-id',
      params: {
        productName: slugify(name),
        id: `${id || product.id}`,
      },
    })
  }

  const getOrderProductDetailRoute = (
    product: OrderProduct,
    id?: number,
  ): string => {
    const name = product.attributes.name.label
    return localePath({
      name: 'p-slug',
      params: {
        slug: `${slugify(name)}-${id || product.id}`,
      },
    })
  }

  const getSearchRoute = (term: string): string => {
    return localePath({
      name: routeList.search.name,
      query: { term },
    })
  }

  const buildCategorySuggestionRoute = ({
    categorySuggestion,
  }: CategorySearchSuggestion): RouteLocationRaw => {
    const { category, filters } = categorySuggestion
    return {
      path: buildCategoryPath(category),
      query: buildFiltersQuery(filters),
    }
  }

  const getSearchSuggestionPath = (
    suggestion: SearchEntity,
  ): string | undefined => {
    if (!suggestion?.type) {
      return
    }

    if (isProductSuggestion(suggestion)) {
      return getProductDetailRoute(
        suggestion.productSuggestion.product.id,
        getFirstAttributeValue(
          suggestion.productSuggestion.product.attributes,
          'name',
        )?.label,
      )
    }

    if (isCategorySuggestion(suggestion)) {
      const route = buildCategorySuggestionRoute(suggestion)
      return localePath(route)
    }
  }

  const getOrderDetailsRoute = (id: number): string => {
    return localePath({
      name: routeList.orderDetail.name,
      params: { id },
    })
  }

  const getLocalizedRoute = (route: RouteLocationRaw) => {
    if (typeof route !== 'string') {
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

  const buildCategoryPath = ({
    id,
    path,
  }: Category | { id: number; path: string }): string => {
    return localePath(`${routeList.category.path}${path}-${id}`)
  }

  return {
    localizedNavigateTo,
    getProductDetailRoute,
    getSearchRoute,
    getSearchSuggestionPath,
    getOrderDetailsRoute,
    getLocalizedRoute,
    buildCategorySuggestionRoute,
    buildCategoryPath,
  }
}
