import {
  type BasketItem,
  type Product,
  getFirstAttributeValue,
  extendPromise,
} from '@scayle/storefront-nuxt'
import { ref, watchPostEffect } from 'vue'
import { useToast } from '~/composables/useToast'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import { useNuxtApp } from '#app'
import {
  bundleBasketItemsByGroup,
  getPartitionedBasketItems,
  routeList,
  sortBasketItemsByNameAndSize,
  type BundledBasketItems,
} from '~/utils'
import { useBasket } from '#storefront/composables'
import { BasketListingMetadata } from '~/constants'

const listingMetaData = {
  id: BasketListingMetadata.ID,
  name: BasketListingMetadata.NAME,
}

type OrderedItems<T> = {
  standAlone: T[]
  groupedItems: BundledBasketItems<T>
}

export function useBasketActions() {
  const { $i18n } = useNuxtApp()

  const toast = useToast()

  const { trackRemoveFromBasket, trackBasket, collectBasketItems } =
    useTrackingEvents()

  const basket = useBasket()

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

    toast.show(message, {
      action,
      ...(isAddedToBasket && { to: routeList.basket }),
    })
  }

  const getGroupedProducts = (itemGroupId?: string) => {
    if (!itemGroupId) {
      return
    }

    return (basket.items.value ?? [])
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

    await basket.removeItem({ variantId: variant.id })

    if (!itemGroup) {
      trackRemoveFromBasket({ product, quantity, variant })
    } else {
      trackRemoveFromBasket({ products: groupedProducts })
    }

    trackBasket(
      collectBasketItems(basket.items.value || [], {
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

  // TODO: Investigate why when using computed for ordered items instead is causing
  // UI issues (similar issue to the popover basket items)
  watchPostEffect(() => {
    orderedItems.value = updateBasketItems(basket.items.value ?? [])
  })

  const fetching = basket.fetching
  const isBasketEmpty = basket.isEmpty
  const basketData = basket.data
  const basketCount = basket.count
  const basketItems = basket.items

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
    },
  )
}
