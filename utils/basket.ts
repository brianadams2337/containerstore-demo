import { alphabetical, group, sort } from 'radash'
import {
  getFirstAttributeValue,
  type BasketItem,
} from '@scayle/storefront-nuxt'

export type BundledBasketItems<T = unknown> = Partial<Record<string, T[]>>

export const sortBasketItemsByNameAndSize = (
  items: BasketItem[],
): BasketItem[] => {
  const sortedAlphabetically = alphabetical(
    items,
    (item: BasketItem) =>
      getFirstAttributeValue(item.product.attributes, 'name')?.label ?? '',
  )
  return sort(
    sortedAlphabetically,
    (item: BasketItem) =>
      getFirstAttributeValue(item.variant?.attributes, 'size')?.id ?? 0,
  )
}

export const sortBasketItemsByIsSoldOut = (
  items: BasketItem[],
): BasketItem[] => {
  return sort(items, ({ product }) => Number(product.isSoldOut))
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
  return group(items, (item: BasketItem) => item.itemGroup?.id ?? '-1')
}
