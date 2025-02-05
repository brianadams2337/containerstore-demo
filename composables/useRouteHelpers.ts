import {
  type Category,
  type CategorySearchSuggestion,
  type NavigationTreeItem,
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
  isExternalLink,
  isCategorySuggestion,
  isProductSuggestion,
  normalizePathRoute,
  routeList,
  isNavigationItemSuggestion,
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

  const getProductDetailRoute = (id: number, name?: string): string => {
    return localePath({
      name: 'p-productName-id',
      params: {
        productName: slugify(name),
        id: `${id}`,
      },
    })
  }

  const getSearchRoute = (term: string): string => {
    return localePath({
      name: routeList.search.name,
      query: { 'filters[term]': term },
    })
  }

  const buildCategorySuggestionRoute = ({
    categorySuggestion,
  }: CategorySearchSuggestion) => {
    const { category, filters } = categorySuggestion
    return {
      path: buildCategoryPath(category),
      query: buildFiltersQuery(filters),
    } satisfies RouteLocationRaw
  }

  const getSearchSuggestionPath = (
    suggestion: SearchEntity,
  ): string | undefined => {
    if (!suggestion?.type) {
      return
    }

    if (isProductSuggestion(suggestion)) {
      const name = getFirstAttributeValue(
        suggestion.productSuggestion.product.attributes,
        'name',
      )?.label

      if (!name) {
        return
      }

      return getProductDetailRoute(
        suggestion.productSuggestion.product.id,
        name,
      )
    }

    if (isCategorySuggestion(suggestion)) {
      const route = buildCategorySuggestionRoute(suggestion)
      return localePath(route)
    }

    if (isNavigationItemSuggestion(suggestion)) {
      const { route } =
        buildNavigationTreeItemRoute(
          suggestion.navigationItemSuggestion.navigationItem,
        ) ?? {}

      if (typeof route === 'string') {
        return route
      }

      return route?.path ? localePath(route.path) : undefined
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

    if (isExternalLink(route)) {
      return route
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

  const buildNavigationTreeItemRoute = (
    navigationItem: NavigationTreeItem,
  ): { route: RouteLocationRaw; openInNew: boolean } | undefined => {
    switch (navigationItem.type) {
      case 'category': {
        if (navigationItem.category) {
          return {
            route: {
              path: buildCategoryPath(navigationItem.category),
              query: buildFiltersQuery(navigationItem.filters),
            },
            openInNew: false,
          }
        }
        return undefined
      }

      case 'page': {
        return {
          route: getLocalizedRoute(navigationItem.page),
          openInNew: true,
        }
      }

      case 'individual-link': {
        return {
          route: getLocalizedRoute(navigationItem.options?.url ?? ''),
          openInNew: navigationItem.options?.isOpenInNewWindow ?? false,
        }
      }
      default:
        return undefined
    }
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
    buildNavigationTreeItemRoute,
  }
}
