import {
  getFirstAttributeValue,
  type BasketItem,
} from '@scayle/storefront-nuxt'

export type BundledBasketItems<T = unknown> = Partial<Record<string, T[]>>

export const sortBasketItemsByNameAndSize = (
  items: BasketItem[],
): BasketItem[] => {
  const sortedAlphabetically = _alphabetical(
    items,
    (item: BasketItem) =>
      getFirstAttributeValue(item.product.attributes, 'name')?.label ?? '',
  )
  return _sort(
    sortedAlphabetically,
    (item: BasketItem) =>
      getFirstAttributeValue(item.variant?.attributes, 'size')?.id ?? 0,
  )
}

export const sortBasketItemsByIsSoldOut = (
  items: BasketItem[],
): BasketItem[] => {
  return _sort(items, ({ product }) => Number(product.isSoldOut))
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

export const bundleBasketItemsByGroup = (
  items: BasketItem[] = [],
): BundledBasketItems<BasketItem> => {
  return _group(items, (item: BasketItem) => item.itemGroup?.id ?? '-1')
}
