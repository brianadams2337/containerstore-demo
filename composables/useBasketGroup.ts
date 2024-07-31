import {
  type AddOrUpdateItemType,
  type BasketWithOptions,
} from '@scayle/storefront-nuxt'
import { nanoid } from 'nanoid'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { useBasket, useRpcCall } from '#storefront/composables'

type AggregateGroupParams = {
  mainItem: AddOrUpdateItemType
  items: AddOrUpdateItemType[]
}

export function useBasketGroup(
  withParams?: MaybeRefOrGetter<BasketWithOptions>,
) {
  const { fetch: refreshBasket } = useBasket()
  const addGroupToBasketRpc = useRpcCall('addGroupToBasket')

  const aggregateAsGroup = ({
    mainItem,
    items,
  }: AggregateGroupParams): AddOrUpdateItemType[] => {
    const groupId = nanoid(8)
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
    await addGroupToBasketRpc({
      items: aggregatedGroup,
      with: toValue(withParams),
    })
    await refreshBasket()
  }

  return { addGroupToBasket }
}
