import {
  getFirstAttributeValue,
  type Product,
  type Variant,
} from '@scayle/storefront-nuxt'

export function useWishlistActions() {
  const { $alert, $i18n } = useNuxtApp()

  const { trackRemoveFromWishlist, trackAddToWishlist } = useTrackingEvents()
  const route = useRoute()
  const { pageState } = usePageState()

  const getWishlistToastMessage = (
    productName: string,
    addedToWishlist: boolean,
  ) => {
    return addedToWishlist
      ? $i18n.t('wishlist.notification.add_to_wishlist', {
          productName,
        })
      : $i18n.t('wishlist.notification.remove_from_wishlist', {
          productName,
        })
  }

  const showWishlistToast = (
    isAddedToWishlist: boolean,
    item: Product | null,
  ) => {
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

  const trackWishlistEvent = (
    action: 'added' | 'removed',
    params: {
      product: Product | null
      variant?: Variant
      listingMetaData?: ListItem
    },
  ) => {
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

  return {
    showWishlistToast,
    trackWishlistEvent,
  }
}
