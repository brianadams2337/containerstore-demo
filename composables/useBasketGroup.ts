import {
  BasketWithOptions,
  MIN_WITH_PARAMS_BASKET,
  rpcCall,
  AddOrUpdateItemType,
  BasketItem,
} from '@scayle/storefront-nuxt'

type AggregateGroupParams = {
  mainItem: AddOrUpdateItemType
  items: AddOrUpdateItemType[]
}

export async function useBasketGroup(
  withParams?: MaybeRefOrGetter<BasketWithOptions>,
) {
  const groupId = Math.floor(Math.random() * 100000000).toString()

  const nuxtApp = useNuxtApp()
  const { fetch: refreshBasket } = await useBasket()

  const defaultParams = nuxtApp.$config.public?.withParams
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
        customData: { id: groupId, isMainItem: true, isRequired: true },
        itemGroup: { id: groupId, isMainItem: true, isRequired: true },
      },
      ...items.map((item) => ({
        ...item,
        customData: { id: groupId, isMainItem: true, isRequired: true },
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
