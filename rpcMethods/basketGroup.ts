import {
  type AddOrUpdateItemType,
  type BasketResponseData,
  type BasketWithOptions,
  ExistingItemHandling,
  MIN_WITH_PARAMS_BASKET,
  type Product,
  type RpcContext,
  type RpcHandler,
  type Variant,
  rpcMethods,
} from '@scayle/storefront-nuxt'

const getWithParams = (
  params: { with?: BasketWithOptions },
  context: RpcContext,
): BasketWithOptions => {
  return params.with ?? context.withParams?.basket ?? MIN_WITH_PARAMS_BASKET
}

export const addGroupToBasket: RpcHandler<
  { items: AddOrUpdateItemType[]; with?: BasketWithOptions },
  BasketResponseData<Product, Variant>
> = async function addGroupToBasket(options, context: RpcContext) {
  const resolvedWith: BasketWithOptions = getWithParams(
    { with: options.with },
    context,
  )
  return await rpcMethods.addItemsToBasket(
    {
      items: options.items,
      existingItemHandling: ExistingItemHandling.KeepExisting,
      with: resolvedWith,
    },
    context,
  )
}
