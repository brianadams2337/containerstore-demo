import {
  type BasketWithOptions,
  rpcCall,
  type AddOrUpdateItemType,
} from '@scayle/storefront-nuxt'
import { nanoid } from 'nanoid'

type AggregateGroupParams = {
  mainItem: AddOrUpdateItemType
  items: AddOrUpdateItemType[]
}

export async function useBasketGroup(
  withParams?: MaybeRefOrGetter<BasketWithOptions>,
) {
  const groupId = nanoid()
  const nuxtApp = useNuxtApp()
  const currentShop = useCurrentShop()
  const { fetch: refreshBasket } = await useBasket()

  const aggregateAsGroup = ({
    mainItem,
    items,
  }: AggregateGroupParams): AddOrUpdateItemType[] => {
    return [
      {
        ...mainItem,
        itemGroup: { id: groupId, isMainItem: true, isRequired: true },
      },
      ...items.map((item) => ({
        ...item,
        itemGroup: { id: groupId, isMainItem: false, isRequired: true },
      })),
    ]
  }

  const addGroupToBasket = async ({
    mainItem,
    items,
  }: AggregateGroupParams) => {
    const aggregatedGroup = aggregateAsGroup({ mainItem, items })
    await rpcCall(
      nuxtApp,
      'addGroupToBasket',
      currentShop.value,
    )({ items: aggregatedGroup, with: toValue(withParams) })
    await refreshBasket()
  }

  return { addGroupToBasket }
}
