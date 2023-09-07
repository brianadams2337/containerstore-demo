import {
  Category,
  getFirstAttributeValue,
  Product,
  slugify,
  ProductSuggestion,
  BrandOrCategorySuggestion,
} from '@scayle/storefront-nuxt'
import { RouteLocationRaw } from '#vue-router'

export const toLocalePath = (route: RouteLocationRaw): RouteLocationRaw => {
  const localePath = useLocalePath()
  const router = useRouter()
  return localePath(router.resolve(route))
}

export const getProductDetailRoute = (
  product: Product,
  id?: number,
): RouteLocationRaw => {
  const name = getFirstAttributeValue(product.attributes, 'name')?.label
  return {
    name: 'p-name-id',
    params: {
      name: `${slugify(name)}`,
      id: id || product.id,
    },
  }
}

export const getProductDetailPath = (product: Product, id?: number) => {
  const name = getFirstAttributeValue(product.attributes, 'name')?.label
  return `/p/${slugify(name)}-${id || product.id}`
}

export const getSearchRoute = (term: string): RouteLocationRaw => {
  return {
    name: 'search',
    query: { term },
  }
}

export const getCategoryPath = (category: Category) => {
  if (!category) {
    return
  }
  return `${category.path}`
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
  return category && brand
    ? `${getCategoryPath(category)}?brand=${brand?.id}`
    : getCategoryPath(category)
}

type Link =
  | 'home'
  | 'checkout'
  | 'wishlist'
  | 'basket'
  | 'signin'
  | 'user'
  | 'order'
  | 'account'
  | 'pdp'

export type LinkList = Record<Link, { name: string; path: string }>

export const routeList: LinkList = {
  home: { name: 'index', path: '/' },
  checkout: { name: 'checkout', path: '/checkout' },
  wishlist: { name: 'wishlist', path: '/wishlist' },
  basket: { name: 'basket', path: '/basket' },
  signin: { name: 'signin', path: '/signin' },
  order: { name: 'account-order', path: '/account/order' },
  user: { name: 'account-user', path: '/account/user' },
  account: { name: 'account', path: '/account' },
  pdp: { name: 'p-name-id', path: '/p/' },
} as const
