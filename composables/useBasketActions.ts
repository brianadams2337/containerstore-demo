import {
  type BasketItem,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'

const listingMetaData = {
  id: BasketListingMetadata.ID,
  name: BasketListingMetadata.NAME,
}

export default async () => {
  const basket = await useBasket()
  const { bundleByGroup } = await useBasketGroup()

  const { trackRemoveFromBasket, trackBasket, collectBasketItems } =
    useTrackingEvents()

  const removeItem = async (item: BasketItem) => {
    await basket.removeItem({ variantId: item.variant.id })

    trackRemoveFromBasket(item.product, item.quantity, item.variant)
    trackBasket(
      collectBasketItems(basket.items.value || [], {
        listId: listingMetaData.id,
        listName: listingMetaData.name,
      }),
    )
  }

  // Remove this to use bapi default: order by updated quantity
  const orderedItems = computed(() => {
    const items = basket.items.value || []
    const standAlone: BasketItem[] = []
    const itemsWithGroups: BasketItem[] = []

    items.forEach((item: BasketItem) =>
      item.itemGroup?.id ? itemsWithGroups.push(item) : standAlone.push(item),
    )

    return {
      standAlone: sortBasketItems(standAlone),
      groupedItems: bundleByGroup(sortBasketItems(itemsWithGroups)),
    }
  })

  const sortBasketItems = (items: BasketItem[]) => {
    const sortedAlphabetically = useAlphabetical(
      items,
      (item: BasketItem) =>
        getFirstAttributeValue(item.product.attributes, 'name')?.label ?? '',
    )
    return useSort(
      sortedAlphabetically,
      (item: BasketItem) =>
        getFirstAttributeValue(item.variant?.attributes, 'size')?.id ?? 0,
    )
  }

  const fetching = basket.fetching
  const isBasketEmpty = basket.isEmpty
  const basketData = basket.data
  const basketCount = basket.count
  const basketItems = basket.items

  return {
    removeItem,
    orderedItems,
    fetching,
    basketData,
    basketCount,
    listingMetaData,
    basketItems,
    isBasketEmpty,
  }
}
