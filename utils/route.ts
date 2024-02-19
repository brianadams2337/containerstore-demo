import type { Category } from '@scayle/storefront-nuxt'

const getCategoryPath = (category: Category) => {
  if (!category) {
    return
  }
  return `${category.path}`
}

export const normalizePathRoute = (path: string) => {
  return path.startsWith('/') ? path : `/${path}`
}

export const hasLocalePrefix = (path: string, prefix?: string) => {
  const components = path.split('/')
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
  | 'orderDetail'
  | 'search'
  | 'osp'

export type LinkList = Record<
  Link,
  {
    name: string
    path: string
    parameter?: string
    query?: { [key: string]: string }
  }
>

export const routeList: LinkList = {
  home: { name: 'index', path: '/' },
  checkout: { name: 'checkout', path: '/checkout' },
  search: { name: 'search', path: '/search' },
  wishlist: { name: 'wishlist', path: '/wishlist' },
  basket: { name: 'basket', path: '/basket' },
  signin: { name: 'signin', path: '/signin' },
  signup: { name: 'signin', path: '/signin', query: { register: 'true' } },
  orders: { name: 'account-orders', path: '/account/orders' },
  user: { name: 'account-user', path: '/account/user' },
  account: { name: 'account', path: '/account' },
  pdp: { name: 'p-name-id', path: '/p/' },
  orderDetail: { name: 'account-orders-id', path: '/account/orders/' },
  osp: { name: 'success', path: '/success' },
} as const

export { getCategoryPath }
