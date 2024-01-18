export async function useProductDetailsBasketActions() {
  const { $alert, $i18n } = useNuxtApp()

  const { product, hasOneSizeVariantOnly, activeVariant, quantity, brand } =
    await useProductDetails()

  const { fetching: basketIdle, addItem: addBasketItem } = await useBasket()

  const { highestPriorityPromotion, isBuyXGetYPrioritized } =
    await useProductPromotions(product)

  const { addGroupToBasket } = await useBasketGroup()

  const { selectedAddOns, isAnyAddOnSelected } =
    useProductDetailsAddOns(product)

  const { trackAddToBasket } = useTrackingEvents()

  const { openBasketFlyout } = useFlyouts()

  const addItemToBasket = async () => {
    if (hasOneSizeVariantOnly.value && product.value?.variants) {
      activeVariant.value = product.value?.variants[0]
    }

    if (!activeVariant.value) {
      $alert.show($i18n.t('basket.notification.select_size'), 'CONFIRM')
      return
    }

    const productName = brand.value || $i18n.t('wishlist.product')
    const promotionId = highestPriorityPromotion.value?.id

    try {
      isAnyAddOnSelected.value
        ? await addGroupToBasket({
            mainItem: { variantId: activeVariant.value.id, quantity: 1 },
            items: [
              ...Object.keys(selectedAddOns.value).map((v) => ({
                variantId: parseInt(v),
                quantity: 1,
              })),
            ],
          })
        : await addBasketItem({
            variantId: activeVariant.value.id,
            quantity: quantity.value,
            ...(!promotionId && { promotionId: null }),
            ...(promotionId && !isBuyXGetYPrioritized.value && { promotionId }),
          })

      openBasketFlyout()

      showAddToBasketToast(true, product.value)

      if (product.value) {
        trackAddToBasket({
          product: product.value,
          variant: activeVariant.value,
          index: 1,
        })
      }
    } catch {
      $alert.show(
        $i18n.t('basket.notification.add_to_basket_error', { productName }),
        'CONFIRM',
      )
    }
  }

  return { addItemToBasket, basketIdle }
}
