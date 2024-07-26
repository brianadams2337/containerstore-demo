import type { RouteParams } from '#vue-router'

export const getCategoryId = (route: RouteParams): number => {
  const id = Array.isArray(route.id) ? route.id[0] : route.id
  return parseInt(id, 10)
}

export const normalizePathRoute = (path: string) => {
  return path.startsWith('/') ? path : `/${path}`
}

export const hasLocalePrefix = (path: string, prefix?: string) => {
  const components = normalizePathRoute(path).split('/')
  return components[1] && components[1] === prefix
}

type Link =
  | 'home'
  | 'checkout'
  | 'wishlist'
  | 'basket'
  | 'signin'
  | 'signup'
  | 'user'
  | 'orders'
  | 'account'
  | 'pdp'
  | 'category'
  | 'orderDetail'
  | 'search'
  | 'osp'
  | 'location'
  | 'subscriptionOverview'

export type LinkList = Record<
  Link,
  {
    name: string
    path: string
    isProtected?: boolean
    parameter?: string
    query?: { [key: string]: string }
  }
>

export const routeList: LinkList = {
  home: { name: 'index', path: '/' },
  search: { name: 'search', path: '/search' },
  wishlist: { name: 'wishlist', path: '/wishlist' },
  category: { name: 'c-category-slug-id', path: '/c' },
  pdp: { name: 'p-name-id', path: '/p' },
  osp: { name: 'success', path: '/success' },
  location: { name: 'location', path: '/location' },
  basket: { name: 'basket', path: '/basket' },
  signin: { name: 'signin', path: '/signin' },
  signup: { name: 'signin', path: '/signin', query: { register: 'true' } },
  checkout: { name: 'checkout', path: '/checkout', isProtected: true },
  user: { name: 'account-user', path: '/account/user', isProtected: true },
  account: { name: 'account', path: '/account', isProtected: true },
  orders: {
    name: 'account-orders',
    path: '/account/orders',
    isProtected: true,
  },
  orderDetail: {
    name: 'account-orders-id',
    path: '/account/orders',
    isProtected: true,
  },
  subscriptionOverview: {
    name: 'subscription-overview',
    path: '/account/subscription',
    isProtected: true,
  },
} as const

export const getProtectedRouteList = (exclude?: string): string[] => {
  return Object.entries(routeList)
    .filter(([key, value]) => value.isProtected && exclude !== key)
    .map(([, value]) => value.path)
}
