import {
  Category,
  getFirstAttributeValue,
  Product,
  slugify,
  ProductSuggestion,
  BrandOrCategorySuggestion,
} from '@scayle/storefront-nuxt'
import { RouteLocationRaw } from '#vue-router'
import { OrderProduct } from '~/types/osp'

const getCategoryPath = (category: Category) => {
  if (!category) {
    return
  }
  return `${category.path}`
}

export const toLocalePath = (route: RouteLocationRaw): RouteLocationRaw => {
  const localePath = useLocalePath()
  const router = useRouter()
  return localePath(router.resolve(route)) || route
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

  const product = (suggestion as ProductSuggestion).product
  if (product) {
    return getProductDetailPath(product)
  }

  const category = (suggestion as BrandOrCategorySuggestion).category
  const brand = (suggestion as BrandOrCategorySuggestion).brand
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

export type LinkList = Record<Link, { name: string; path: string }>

export const routeList: LinkList = {
  home: { name: 'index', path: '/' },
  checkout: { name: 'checkout', path: '/checkout' },
  wishlist: { name: 'wishlist', path: '/wishlist' },
  basket: { name: 'basket', path: '/basket' },
  signin: { name: 'signin', path: '/signin' },
  orders: { name: 'account-orders', path: '/account/orders' },
  user: { name: 'account-user', path: '/account/user' },
  account: { name: 'account', path: '/account' },
  pdp: { name: 'p-name-id', path: '/p/' },
  orderDetail: { name: 'account-orders-id', path: '/account/orders/' },
} as const

export { getCategoryPath }
