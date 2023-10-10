import {
  BasketWithOptions,
  MIN_WITH_PARAMS_BASKET,
  rpcCall,
  AddOrUpdateItemType,
  BasketItem,
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
  const { fetch: refreshBasket } = await useBasket()

  const defaultParams = nuxtApp.$config.storefront?.withParams
    ?.basket as BasketWithOptions
  const basketParams = computed(() => {
    return toValue(withParams) || defaultParams || MIN_WITH_PARAMS_BASKET
  })

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
    )({ items: aggregatedGroup, with: basketParams.value })
    await refreshBasket()
  }

  const bundleByGroup = (items: BasketItem[] = []) => {
    return useGroup(items, (item: BasketItem) => item.itemGroup?.id ?? '-1')
  }

  return { addGroupToBasket, bundleByGroup }
}
