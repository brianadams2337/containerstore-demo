import type { AddOrUpdateItemType } from '@scayle/storefront-nuxt'
import { isSubscriptionAlreadyInBasket } from '~/modules/subscription/helpers/subscription'

export async function useProductDetailsBasketActions() {
  const { $i18n } = useNuxtApp()

  const notification = useNotification()

  const {
    product,
    productId,
    hasOneSizeVariantOnly,
    activeVariant,
    quantity,
    name,
  } = await useProductDetails()

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
    useProductDetailsAddOns(productId.value, product)

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

  const addItemToBasket = async (priorItemToAdd?: AddOrUpdateItemType) => {
    if (!product.value) {
      return
    }
    if (hasOneSizeVariantOnly.value && product.value.variants) {
      activeVariant.value = product.value.variants[0]
    }

    if (!activeVariant.value) {
      notification.show($i18n.t('basket.notification.select_size'), 'CONFIRM')
      return
    }

    if (
      isSubscriptionAlreadyInBasket(
        !!priorItemToAdd,
        activeVariant.value.id,
        basketItems.value,
      )
    ) {
      notification.show(
        $i18n.t('basket.notification.subscription_already_in_basket_error', {
          productName: name.value,
        }),
        'CONFIRM',
      )
      return
    }

    const promotionId = highestPriorityPromotion.value?.id

    try {
      if (priorItemToAdd) {
        await addBasketItem(priorItemToAdd)
      } else if (isAnyAddOnSelected.value) {
        await addGroupToBasket({
          mainItem: { variantId: activeVariant.value.id, quantity: 1 },
          items: [
            ...selectedAddOnVariantIds.value.map((variantId) => ({
              variantId,
              quantity: 1,
            })),
          ],
        })
      } else {
        await addBasketItem({
          variantId: activeVariant.value.id,
          quantity: quantity.value,
          ...(!promotionId && { promotionId: null }),
          ...(promotionId && !isBuyXGetYPrioritized.value && { promotionId }),
        })
      }

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
        $i18n.t('basket.notification.add_to_basket_error', {
          productName: name.value,
        }),
        'CONFIRM',
      )
    }
  }

  return { addItemToBasket, basketIdle }
}
