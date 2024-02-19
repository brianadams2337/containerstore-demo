import {
  getFirstAttributeValue,
  type WishlistItem,
} from '@scayle/storefront-nuxt'

export const wishlistListingMetadata = {
  id: WishlistListingMetadata.ID,
  name: WishlistListingMetadata.NAME,
} as const

export async function useWishlistPage() {
  const wishlist = await useWishlist({ options: { lazy: true } })
  const basket = await useBasket({ options: { lazy: true } })

  const { $i18n } = useNuxtApp()

  const { trackViewItemList, trackWishlist, collectProductListItems } =
    useTrackingEvents()

  if (wishlist.error.value) {
    throw wishlist.error.value
  }

  const orderedItems = computed(() => {
    return _alphabetical(wishlist.items.value || [], (item: WishlistItem) => {
      return (
        getFirstAttributeValue(item.product?.attributes, 'name')?.label ?? ''
      )
    })
  })

  useSeoMeta({
    robots: 'noindex,follow',
    title: $i18n.t('navigation.wishlist'),
  })

  onMounted(() => {
    if (!wishlist.data.value) {
      return
    }
    trackWishlist(
      collectProductListItems(wishlist.products.value, {
        listId: wishlistListingMetadata.id,
        listName: wishlistListingMetadata.name,
      }),
    )
    trackViewItemList({
      items: wishlist.products.value,
      listingMetaData: wishlistListingMetadata,
      source: 'wishlist',
    })
  })

  const count = wishlist.count
  const fetching = basket.fetching

  return {
    orderedItems,
    count,
    fetching,
  }
}
