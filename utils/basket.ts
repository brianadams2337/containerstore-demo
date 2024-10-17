import {
  type BasketItem,
  type BasketResponseData,
  FetchError,
  getFirstAttributeValue,
  HttpStatusCode,
} from '@scayle/storefront-nuxt'

export type BundledBasketItems<T = unknown> = Partial<Record<string, T[]>>

export const sortBasketItemsByNameAndSize = (
  items: BasketItem[],
): BasketItem[] => {
  const getSortingBasketItemName = (item: BasketItem) =>
    getFirstAttributeValue(item.product.attributes, 'name')?.label ?? ''

  const sortedAlphabetically = items.toSorted((a, b) =>
    getSortingBasketItemName(a).localeCompare(getSortingBasketItemName(b)),
  )

  const getSortingBasketItemSize = (item: BasketItem) =>
    getFirstAttributeValue(item.variant?.attributes, 'size')?.id ?? 0

  return sortedAlphabetically.toSorted(
    (a, b) => getSortingBasketItemSize(a) - getSortingBasketItemSize(b),
  )
}

export const sortBasketItemsByIsSoldOut = (
  items: BasketItem[],
): BasketItem[] => {
  const getSortingBasketItemProductAttribute = ({ product }: BasketItem) =>
    Number(product.isSoldOut)

  return items.toSorted(
    (a, b) =>
      getSortingBasketItemProductAttribute(a) -
      getSortingBasketItemProductAttribute(b),
  )
}

export const getPartitionedBasketItems = (items: BasketItem[] = []) => {
  return items.reduce<Record<'standAlone' | 'groupedItems', BasketItem[]>>(
    (acc, item: BasketItem) => {
      ;(item.itemGroup?.id ? acc.groupedItems : acc.standAlone).push(item)
      return acc
    },
    { standAlone: [], groupedItems: [] },
  )
}

export const bundleBasketItemsByGroup = (
  items: BasketItem[] = [],
): BundledBasketItems<BasketItem> => {
  return items.reduce(
    (acc, item) => {
      const groupId = item.itemGroup?.id ?? '-1'
      if (!acc[groupId]) {
        acc[groupId] = []
      }
      acc[groupId].push(item)
      return acc
    },
    {} as Record<string, BasketItem[]>,
  )
}

export const getBasketToastErrorMessageKey = (error: unknown) => {
  if (error instanceof FetchError) {
    if (error.response.status === HttpStatusCode.PRECONDITION_FAILED) {
      return 'basket.notification.add_to_basket_variant_out_of_stock_error'
    } else if (error.response.status === HttpStatusCode.CONTENT_TOO_LARGE) {
      return 'basket.notification.add_to_basket_max_basket_items_error'
    }
  }
  return 'basket.notification.add_to_basket_error'
}

export const getBasketTotalWithoutPromotions = (
  basket?: BasketResponseData,
) => {
  if (!basket) {
    return 0
  }

  const promotionReductionsList = basket.cost.appliedReductions
    .filter(({ category }) => category === 'promotion')
    .map(({ amount }) => amount.absoluteWithTax)

  const promotionReductionsSum = promotionReductionsList.reduce(
    (acc, item) => acc + item,
    0,
  )

  return basket.cost.withTax + promotionReductionsSum
}
