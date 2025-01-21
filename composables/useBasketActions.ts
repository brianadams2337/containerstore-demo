import {
  type BasketItem,
  extendPromise,
  type AddOrUpdateItemType,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'
import { ExistingItemHandling } from '@scayle/storefront-api'
import { useI18n } from 'vue-i18n'
import { useToast } from '~/composables/useToast'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import { useRouteHelpers } from '~/composables'
import {
  routeList,
  getBasketToastErrorMessageKey,
  isBuyXGetYType,
  isFreeGiftEligible,
} from '~/utils'
import { useBasket, useLog } from '#storefront/composables'
import {
  hasSubscriptionCustomData,
  getSubscriptionItemGroup,
} from '~/modules/subscription/helpers/subscription'

export type AddToBasketItem = AddOrUpdateItemType & {
  productName: string
  interval?: string
  existingItemHandling?: ExistingItemHandling
}

export type UseBasketActionsReturn = {
  /** A function which adds an item to the basket and shows a success or error toast. */
  addItem: (item: AddToBasketItem) => Promise<void>
  /** A function which removes an item from the basket and shows a success or error toast. It also triggers a `remove_from_cart` tracking event.‚ */
  removeItem: (item: BasketItem) => Promise<void>
  /** A function which updates the quantity of the passed basket item and shows a success or error toast. It also triggers a `add_to_basket` tracking event.  */
  updateItemQuantity: (item: BasketItem, newQuantity: number) => Promise<void>
}

/**
 * A composable to make it easier to add, update and remove items from the basket.
 * In addition of interacting with the basket, it also takes care of tracking and displaying toast messages.
 *
 * @returns An {@link UseBasketActionsReturn} object containing functions to add, update and remove items from the basket.
 *
 * */

export function useBasketActions(): UseBasketActionsReturn &
  Promise<UseBasketActionsReturn> {
  const i18n = useI18n()
  const log = useLog()

  const { show } = useToast()

  const { trackRemoveFromBasket, trackAddToBasket } = useTrackingEvents()

  const { getLocalizedRoute } = useRouteHelpers()

  const basket = useBasket()
  const {
    items: basketItems,
    removeItem: removeBasketItem,
    addItem: addItemToBasket,
  } = basket

  const removeItem = async ({ product, variant, quantity }: BasketItem) => {
    await removeBasketItem({ variantId: variant.id })

    trackRemoveFromBasket({ product, quantity, variant })
  }

  const showAddItemSuccessMessage = (
    item: AddToBasketItem,
    hasSubscriptionData: boolean,
  ) => {
    const message = hasSubscriptionData
      ? i18n.t('basket.notification.add_subscription_to_basket_success', {
          productName: item.productName,
          interval: item.interval,
        })
      : i18n.t('basket.notification.add_to_basket_success', {
          productName: item.productName,
        })

    show(message, {
      type: 'SUCCESS',
      action: 'ROUTE',
      to: getLocalizedRoute(routeList.basket),
    })
  }

  const addItem = async (item: AddToBasketItem) => {
    try {
      const hasSubscriptionData = hasSubscriptionCustomData(item.customData)
      const existingItemHandling =
        item.existingItemHandling || ExistingItemHandling.AddQuantityToExisting

      // The basket considers normal items and subscription items to be the same. By adding an item group to the subscription, we ensure the item to be subscribed will be unique.
      const itemGroup = hasSubscriptionData
        ? getSubscriptionItemGroup(item, basketItems.value || [])
        : item.itemGroup
      await addItemToBasket({ ...item, existingItemHandling, itemGroup })
      showAddItemSuccessMessage(item, hasSubscriptionData)
    } catch (error) {
      log.error('Item could not be added to basket', error)
      show(
        i18n.t(getBasketToastErrorMessageKey(error), {
          productName: item.productName,
        }),
        { type: 'ERROR', action: 'CONFIRM' },
      )
    }
  }

  const updateItemQuantity = async (
    basketItem: BasketItem,
    newQuantity: number,
  ) => {
    const promotionId = basketItem?.promotion?.id
    await addItem({
      variantId: basketItem.variant.id,
      quantity: newQuantity,
      existingItemHandling: ExistingItemHandling.ReplaceExisting,
      customData: basketItem.customData as AddOrUpdateItemType['customData'],
      displayData: basketItem.displayData,
      itemGroup: basketItem.itemGroup,
      promotionId: basketItem.promotionId,
      productName:
        getFirstAttributeValue(basketItem.product?.attributes, 'name')?.label ??
        '',
      ...(promotionId &&
        !isBuyXGetYType(basketItem.promotion) &&
        !isFreeGiftEligible(basketItem) && { promotionId }),
    })

    trackAddToBasket({
      product: basketItem.product,
      variant: basketItem.variant,
      quantity: newQuantity,
    })
  }

  return extendPromise(
    basket.then(() => ({})),
    {
      removeItem,
      addItem,
      updateItemQuantity,
    },
  )
}
