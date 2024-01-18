import {
  type BrandOrCategorySuggestion,
  getFirstAttributeValue,
  type Product,
  type ProductSuggestion,
  slugify,
} from '@scayle/storefront-nuxt'
import type { RouteLocationRaw } from '#vue-router'
import type { NavigateToOptions } from '#app/composables/router'
import { getCategoryPath, routeList } from '~/utils/route'

export function useRouteHelpers() {
  const localePath = useLocalePath()
  const currentShop = useCurrentShop()

  const localizedNavigateTo = (
    route: RouteLocationRaw,
    options?: NavigateToOptions,
  ) => {
    if (!isString(route)) {
      return navigateTo(localePath(route), options)
    }

    const normalizedPath = normalizePathRoute(route)
    const dedupedLocalePath = hasLocalePrefix(
      normalizedPath,
      currentShop.value?.path,
    )
      ? normalizedPath
      : localePath(normalizedPath)

    return navigateTo(dedupedLocalePath, options)
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

  const getSearchSuggestionPath = (
    suggestion: ProductSuggestion | BrandOrCategorySuggestion,
  ) => {
    if (!suggestion) {
      return
    }

    if ('product' in suggestion) {
      return getProductDetailPath(suggestion.product)
    }

    const { category, brand } = suggestion
    const route =
      category && brand
        ? `${getCategoryPath(category)}?brand=${brand?.id}`
        : getCategoryPath(category)

    return route && localePath(route)
  }

  const getOrderDetailsRoute = (id: number): RouteLocationRaw => {
    return localePath({
      name: routeList.orderDetail.name,
      params: { id },
    })
  }

  return {
    localizedNavigateTo,
    getProductDetailRoute,
    getOrderProductDetailRoute,
    getSearchRoute,
    getSearchSuggestionPath,
    getOrderDetailsRoute,
  }
}
