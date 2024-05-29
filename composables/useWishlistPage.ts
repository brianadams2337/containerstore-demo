import { alphabetical } from 'radash'
import {
  getFirstAttributeValue,
  extendPromise,
  type WishlistItem,
} from '@scayle/storefront-nuxt'

export const wishlistListingMetadata = {
  id: WishlistListingMetadata.ID,
  name: WishlistListingMetadata.NAME,
} as const

export async function useWishlistPage() {
  const app = useNuxtApp()

  useSeoMeta({
    robots: 'noindex,follow',
    title: app.$i18n.t('navigation.wishlist'),
  })

  const wishlist = useWishlist()
  const basket = useBasket()

  if (wishlist.error.value) {
    throw wishlist.error.value
  }

  const orderedItems = computed(() => {
    return alphabetical(wishlist.items.value || [], (item: WishlistItem) => {
      const attributes = item.product?.attributes
      return getFirstAttributeValue(attributes, 'name')?.label ?? ''
    })
  })

  const count = wishlist.count
  const fetching = basket.fetching

  return extendPromise(
    Promise.all([wishlist, basket]).then(() => ({})),
    {
      orderedItems,
      count,
      fetching,
      data: wishlist.data,
      products: wishlist.products,
    },
  )
}
