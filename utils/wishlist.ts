import {
  getFirstAttributeValue,
  type Product,
  type Variant,
} from '@scayle/storefront-nuxt'

export const getWishlistToastMessage = (
  productName: string,
  addedToWishlist: boolean,
) => {
  const { $i18n } = useNuxtApp()
  return addedToWishlist
    ? $i18n.t('wishlist.notification.add_to_wishlist', {
        productName,
      })
    : $i18n.t('wishlist.notification.remove_from_wishlist', {
        productName,
      })
}

export const getWishlistParams = (productId: number, variantId?: number) => {
  return variantId ? { variantId } : { productId }
}

export const showWishlistToast = (
  isAddedToWishlist: boolean,
  item: Product | null,
) => {
  const { $alert, $i18n } = useNuxtApp()
  const name =
    getFirstAttributeValue(item?.attributes, 'name')?.label ||
    $i18n.t('wishlist.product')
  const message = getWishlistToastMessage(name, isAddedToWishlist)

  const action = isAddedToWishlist ? 'ROUTE' : 'CONFIRM'

  $alert.show(
    message,
    action,
    isAddedToWishlist ? routeList.wishlist : undefined,
  )
}

export const trackWishlistEvent = (
  action: 'added' | 'removed',
  params: {
    product: Product | null
    variant?: Variant
    listingMetaData?: ListItem
  },
) => {
  const { trackRemoveFromWishlist, trackAddToWishlist } = useTrackingEvents()
  const route = useRoute()
  const { pageState } = usePageState()
  const { product, variant, listingMetaData } = params
  if (!product) {
    return
  }

  const payload = {
    product,
    ...(action === 'added' && { variant }),
    listingMetaData,
    pagePayload: {
      content_name: route.fullPath,
      page_type: pageState.value.type,
      page_type_id: route.params.id?.toString() || '',
    },
  }

  return action === 'added'
    ? trackAddToWishlist(payload)
    : trackRemoveFromWishlist(payload)
}
