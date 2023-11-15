import {
  type Category,
  getFirstAttributeValue,
  type Product,
  slugify,
  type ProductSuggestion,
  type BrandOrCategorySuggestion,
} from '@scayle/storefront-nuxt'
import type { NavigateToOptions } from 'nuxt/dist/app/composables/router'
import type { RouteLocationRaw } from '#vue-router'

const getCategoryPath = (category: Category) => {
  if (!category) {
    return
  }
  return `${category.path}`
}

export const toLocalePath = (route: RouteLocationRaw): RouteLocationRaw => {
  const router = useRouter()
  const localePath = useLocalePath()
  return localePath(router.resolve(route)) || route
}

export const localizedNavigateTo = (
  route: RouteLocationRaw,
  options?: NavigateToOptions,
) => {
  const routePath = toLocalePath(route)
  return navigateTo(routePath, options)
}

export const getProductDetailRoute = (
  product: Product,
  id?: number,
): RouteLocationRaw => {
  const name = getFirstAttributeValue(product.attributes, 'name')?.label
  return toLocalePath({
    name: 'p-slug',
    params: {
      slug: `${slugify(name)}-${id || product.id}`,
    },
  })
}

export const getOrderProductDetailRoute = (
  product: OrderProduct,
  id?: number,
): RouteLocationRaw => {
  const name = product.attributes.name.label
  return toLocalePath({
    name: 'p-slug',
    params: {
      slug: `${slugify(name)}-${id || product.id}`,
    },
  })
}

export const getProductDetailPath = (product: Product, id?: number) => {
  const name = getFirstAttributeValue(product.attributes, 'name')?.label
  return toLocalePath(`/p/${slugify(name)}-${id || product.id}`)
}

export const getSearchRoute = (term: string): RouteLocationRaw => {
  return toLocalePath({
    name: 'search',
    query: { term },
  })
}

export const getSearchSuggestionPath = (
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

  return route && toLocalePath(route)
}

export const getOrderDetailsRoute = (id: number): RouteLocationRaw => {
  return toLocalePath({
    name: routeList.orderDetail.name,
    params: { id },
  })
}

type Link =
  | 'home'
  | 'checkout'
  | 'wishlist'
  | 'basket'
  | 'signin'
  | 'user'
  | 'orders'
  | 'account'
  | 'pdp'
  | 'orderDetail'
  | 'search'
  | 'lookbooks'

export type LinkList = Record<
  Link,
  { name: string; path: string; parameter?: string }
>

export const routeList: LinkList = {
  home: { name: 'index', path: '/' },
  checkout: { name: 'checkout', path: '/checkout' },
  search: { name: 'search', path: '/search' },
  wishlist: { name: 'wishlist', path: '/wishlist' },
  basket: { name: 'basket', path: '/basket' },
  signin: { name: 'signin', path: '/signin' },
  orders: { name: 'account-orders', path: '/account/orders' },
  user: { name: 'account-user', path: '/account/user' },
  account: { name: 'account', path: '/account' },
  pdp: { name: 'p-name-id', path: '/p/' },
  orderDetail: { name: 'account-orders-id', path: '/account/orders/' },
  lookbooks: {
    name: 'lookbooks-slug',
    path: '/lookbooks',
    parameter: 'slug',
  },
} as const

export { getCategoryPath }
