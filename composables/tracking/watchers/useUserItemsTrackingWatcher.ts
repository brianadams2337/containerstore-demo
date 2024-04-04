export const useUserItemsTrackingWatcher = async () => {
  const scope = getCurrentScope()
  const route = useRoute()

  const { data: basket } = await useBasket()
  const { data: wishlist, products: wishlistProducts } = await useWishlist()
  const {
    trackBasket,
    trackWishlist,
    collectBasketItems,
    collectProductListItems,
  } = useTrackingEvents()

  scope?.run(() => {
    watch(
      () => basket.value,
      (newValues, oldValues) => {
        const isBasketPage = route.fullPath.includes('/basket')
        if (didBasketDataChange(oldValues, newValues) && !isBasketPage) {
          trackBasket(
            collectBasketItems(basket.value?.items, {
              listId: BasketListingMetadata.ID,
              listName: BasketListingMetadata.NAME,
            }),
          )
        }
      },
    )

    watch(
      () => wishlist.value,
      (newValues, oldValues) => {
        if (didWishlistDataChange(oldValues, newValues)) {
          trackWishlist(
            collectProductListItems(wishlistProducts.value, {
              listId: WishlistListingMetadata.ID,
              listName: WishlistListingMetadata.NAME,
            }),
          )
        }
      },
    )
  })
}
