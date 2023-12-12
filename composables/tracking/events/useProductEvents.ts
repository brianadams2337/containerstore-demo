import type { Product } from '@scayle/storefront-nuxt'

const collectProductListItems = (
  items: Product[],
  options: { listName: string; listId: string },
) => {
  return items.map(
    (product: Product, idx: number): ProductListData => ({
      product,
      list: {
        name: options.listName,
        id: options.listId,
        index: idx + 1,
      },
    }),
  )
}

const useProductEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => any,
) => {
  const currencyCode = useCurrentShop().value!.currency
  const localePath = useLocalePath()
  const { getProductDetailRoute } = useRouteHelpers()

  return {
    trackSelectItem: ({
      product,
      category,
      listingMetaData,
      index = -1, // index starts from 1
      source,
      variant,
      quantity = 1,
      soldOut = false,
      pagePayload,
    }: TrackSelectItemEventParams) => {
      const payload: any = {
        product,
        destinationUrl: localePath(getProductDetailRoute(product)),
        destination: `product|${product.id}`,
        quantity,
      }

      if (category) {
        payload.category = {
          name: category?.name || '',
          id: category?.id?.toString() || '',
        }
      }
      if (listingMetaData) {
        payload.list = {
          name: listingMetaData.name,
          id: listingMetaData.id,
        }
      }

      if (variant) {
        payload.variant = variant
      }

      if (index > -1) {
        payload.list.index = index
      }

      if (source) {
        payload.source = source
      }

      payload.sold_out = soldOut
      payload.pagePayload = pagePayload

      track('select_item', {
        ...payload,
        currencyCode,
      })
    },
    trackViewItemList: ({
      items,
      listingMetaData,
      paginationOffset = 0,
      source,
      category,
      positionOffset = -1,
    }: TrackViewItemListEventParams) => {
      const itemsToTrack =
        items?.map(
          (product: Product & { index: number }): ProductViewData => ({
            product,
            category: category || {
              name: getDeepestCategoryForTracking(product.categories).name,
              id: getDeepestCategoryForTracking(product.categories).id,
            },
            list: {
              name: listingMetaData.name,
              id: listingMetaData.id,
              index: paginationOffset + (product.index + 1),
            },
            position:
              positionOffset > -1
                ? positionOffset + product.index + 1
                : undefined,
            destinationUrl: String(
              localePath(getProductDetailRoute(product as Product)),
            ),
            destination: `product|${product.id}`,
            source:
              source ||
              `category|${
                getDeepestCategoryForTracking(product.categories).id || ''
              }`,
          }),
        ) || []

      track('view_item_list', {
        items: itemsToTrack,
        currencyCode,
      })
    },

    trackViewItem: ({
      product,
      quantity = 1,
      variant,
    }: TrackViewItemParams) => {
      track('view_item', {
        product,
        quantity,
        variant,
        list: {
          index: 1,
          name: '',
          id: '',
        },
        currencyCode,
      })
    },
    collectProductListItems,
  }
}

export default useProductEvents
