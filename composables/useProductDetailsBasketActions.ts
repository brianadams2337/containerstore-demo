export async function useProductDetailsBasketActions() {
  const { $i18n } = useNuxtApp()

  const notification = useNotification()

  const { product, hasOneSizeVariantOnly, activeVariant, quantity, brand } =
    await useProductDetails()

  const {
    fetching: basketIdle,
    addItem: addBasketItem,
    items: basketItems,
  } = await useBasket()

  const { showAddToBasketToast } = await useBasketActions()

  const { highestPriorityPromotion, isBuyXGetYPrioritized } =
    await useProductPromotions(product)

  const { addGroupToBasket } = await useBasketGroup()

  const { selectedAddOnVariantIds, isAnyAddOnSelected } =
    useProductDetailsAddOns(product)

  const { trackAddToBasket } = useTrackingEvents()

  const { openBasketFlyout } = useFlyouts()

  const getBasketAddOnProducts = () => {
    return _unique(
      (basketItems.value ?? [])
        .filter(({ variant }) =>
          selectedAddOnVariantIds.value.includes(variant.id),
        )
        .map(({ product }) => product),
      (product) => product.id,
    )
  }

  const addItemToBasket = async () => {
    if (hasOneSizeVariantOnly.value && product.value.variants) {
      activeVariant.value = product.value.variants[0]
    }

    if (!activeVariant.value) {
      notification.show($i18n.t('basket.notification.select_size'), 'CONFIRM')
      return
    }

    const productName = brand.value || $i18n.t('wishlist.product')
    const promotionId = highestPriorityPromotion.value?.id

    try {
      isAnyAddOnSelected.value
        ? await addGroupToBasket({
            mainItem: { variantId: activeVariant.value.id, quantity: 1 },
            items: [
              ...selectedAddOnVariantIds.value.map((variantId) => ({
                variantId,
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

      if (isAnyAddOnSelected.value) {
        const products = [product.value, ...getBasketAddOnProducts()].map(
          (product, index) => ({
            ...product,
            index: index + 1,
          }),
        )
        trackAddToBasket({ products })
      } else {
        trackAddToBasket({
          product: product.value,
          variant: activeVariant.value,
          quantity: quantity.value,
          index: 1,
        })
      }
    } catch {
      notification.show(
        $i18n.t('basket.notification.add_to_basket_error', { productName }),
        'CONFIRM',
      )
    }
  }

  return { addItemToBasket, basketIdle }
}
