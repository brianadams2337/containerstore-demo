import {
  type Product,
  getFirstAttributeValue,
  type BasketItem,
} from '@scayle/storefront-nuxt'

export const showAddToBasketToast = (
  isAddedToBasket: boolean,
  item: Product | null,
) => {
  const { $i18n, $alert } = useNuxtApp()

  const productName =
    getFirstAttributeValue(item?.attributes, 'name')?.label ||
    $i18n.t('wishlist.product')

  const message = $i18n.t('basket.notification.add_to_basket_success', {
    productName,
  })

  const action = isAddedToBasket ? 'ROUTE' : 'CONFIRM'

  $alert.show(message, action, isAddedToBasket ? routeList.basket : undefined)
}

export const sortBasketItemsByNameAndSize = (
  items: BasketItem[],
): BasketItem[] => {
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

export const sortBasketItemsByIsSoldOut = (
  items: BasketItem[],
): BasketItem[] => {
  return useSort(items, ({ product }) => Number(product.isSoldOut))
}

export const getPartitionedBasketItems = (items: BasketItem[] = []) => {
  return items.reduce<Record<'standAlone' | 'groupedItems', BasketItem[]>>(
    (acc, item: BasketItem) => {
      item.itemGroup?.id
        ? acc.groupedItems.push(item)
        : acc.standAlone.push(item)
      return acc
    },
    { standAlone: [], groupedItems: [] },
  )
}
