import {
  type BasketItem,
  type Product,
  getFirstAttributeValue,
  extendPromise,
  type AddOrUpdateItemType,
} from '@scayle/storefront-nuxt'
import { ref, watchPostEffect } from 'vue'
import { ExistingItemHandling } from '@scayle/storefront-api'
import { useI18n } from 'vue-i18n'
import { useToast } from '~/composables/useToast'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import { useNuxtApp } from '#app'
import {
  bundleBasketItemsByGroup,
  getPartitionedBasketItems,
  routeList,
  sortBasketItemsByNameAndSize,
  type BundledBasketItems,
  getBasketToastErrorMessageKey,
} from '~/utils'
import { useBasket, useLog } from '#storefront/composables'
import { BasketListingMetadata } from '~/constants'
import { hasSubscriptionCustomData } from '~/modules/subscription/helpers/subscription'

const listingMetaData = {
  id: BasketListingMetadata.ID,
  name: BasketListingMetadata.NAME,
}

type OrderedItems<T> = {
  standAlone: T[]
  groupedItems: BundledBasketItems<T>
}

export type AddToBasketItem = AddOrUpdateItemType & {
  productName: string
  interval?: string
  existingItemHandling?: ExistingItemHandling
}

export function useBasketActions() {
  const { $i18n } = useNuxtApp()
  const { show } = useToast()
  const i18n = useI18n()
  const log = useLog()
  const { trackRemoveFromBasket, trackBasket, collectBasketItems } =
    useTrackingEvents()

  const basket = useBasket()
  const {
    fetching,
    isEmpty: isBasketEmpty,
    data: basketData,
    count: basketCount,
    items: basketItems,
    status: basketStatus,
    removeItem: removeBasketItem,
    addItem: addItemToBasket,
  } = basket

  const showAddToBasketToast = (
    isAddedToBasket: boolean,
    item: Product | null,
  ) => {
    const productName =
      getFirstAttributeValue(item?.attributes, 'name')?.label ||
      $i18n.t('wishlist.product')

    const message = $i18n.t('basket.notification.add_to_basket_success', {
      productName,
    })

    const action = isAddedToBasket ? 'ROUTE' : 'CONFIRM'

    show(message, {
      action,
      ...(isAddedToBasket && { to: routeList.basket }),
    })
  }

  const getGroupedProducts = (itemGroupId?: string) => {
    if (!itemGroupId) {
      return
    }

    return (basketItems.value ?? [])
      .filter(({ itemGroup }) => itemGroup?.id === itemGroupId)
      .map(({ product }) => product)
  }

  const removeItem = async ({
    product,
    variant,
    quantity,
    itemGroup,
  }: BasketItem) => {
    const groupedProducts = getGroupedProducts(itemGroup?.id)

    await removeBasketItem({ variantId: variant.id })

    if (!itemGroup) {
      trackRemoveFromBasket({ product, quantity, variant })
    } else {
      trackRemoveFromBasket({ products: groupedProducts })
    }

    trackBasket(
      collectBasketItems(basketItems.value || [], {
        listId: listingMetaData.id,
        listName: listingMetaData.name,
      }),
    )
  }

  const orderedItems = ref<OrderedItems<BasketItem>>({
    standAlone: [],
    groupedItems: {},
  })

  const updateBasketItems = (items: BasketItem[]) => {
    const data = getPartitionedBasketItems(items)
    return {
      standAlone: sortBasketItemsByNameAndSize(data.standAlone),
      groupedItems: bundleBasketItemsByGroup(
        sortBasketItemsByNameAndSize(data.groupedItems),
      ),
    }
  }

  watchPostEffect(() => {
    orderedItems.value = updateBasketItems(basketItems.value ?? [])
  })

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

    show(message, { type: 'SUCCESS', action: 'ROUTE', to: routeList.basket })
  }

  const addItem = async (item: AddToBasketItem) => {
    try {
      const hasSubscriptionData = hasSubscriptionCustomData(item.customData)
      const existingItemHandling = hasSubscriptionData
        ? ExistingItemHandling.ReplaceExisting
        : item.existingItemHandling ||
          ExistingItemHandling.AddQuantityToExisting
      await addItemToBasket({ ...item, existingItemHandling })
      showAddItemSuccessMessage(item, hasSubscriptionData)
    } catch (e) {
      log.error('Item could not be added to basket', e)
      show(
        i18n.t(getBasketToastErrorMessageKey(e), {
          productName: item.productName,
        }),
        { type: 'ERROR', action: 'CONFIRM' },
      )
    }
  }

  return extendPromise(
    basket.then(() => ({})),
    {
      removeItem,
      orderedItems,
      fetching,
      basketData,
      basketCount,
      listingMetaData,
      basketItems,
      isBasketEmpty,
      showAddToBasketToast,
      basketStatus,
      addItem,
    },
  )
}
