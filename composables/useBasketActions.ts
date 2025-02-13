import { extendPromise, ExistingItemHandling } from '@scayle/storefront-nuxt'
import type { AddOrUpdateItemType, BasketItem } from '@scayle/storefront-nuxt'
import type { rpcMethods } from '@scayle/storefront-core'
import { useI18n } from 'vue-i18n'
import { useToast } from '~/composables/useToast'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import { useRouteHelpers } from '~/composables'
import { routeList, getBasketToastErrorMessageKey } from '~/utils'
import { useBasket, useLog } from '#storefront/composables'
import { hasSubscriptionCustomData } from '~/modules/subscription/helpers/subscription'

// TODO: Export this properly from `storefront-core`
type BasketItemUpdateData = Parameters<
  typeof rpcMethods.updateBasketItem
>[0]['update']

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
 */

export function useBasketActions(): UseBasketActionsReturn &
  Promise<UseBasketActionsReturn> {
  const i18n = useI18n()
  const log = useLog()

  const { show } = useToast()

  const { trackRemoveFromBasket, trackAddToBasket } = useTrackingEvents()

  const { getLocalizedRoute } = useRouteHelpers()

  const basket = useBasket()
  const { removeItemByKey, addItem: addItemToBasket, updateItem } = basket

  const removeItem = async ({
    key,
    product,
    quantity,
    variant,
  }: BasketItem) => {
    await removeItemByKey(key)

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
        item.existingItemHandling ||
        ExistingItemHandling.ADD_QUANTITY_TO_EXISTING
      await addItemToBasket({ ...item, existingItemHandling })
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
    await updateItem(basketItem.key, {
      quantity: newQuantity,
      customData: basketItem?.customData as BasketItemUpdateData['customData'],
      displayData: basketItem?.displayData,
      itemGroup: basketItem?.itemGroup,
      promotionId: basketItem?.promotionId,
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
