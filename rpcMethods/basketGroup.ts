import {
  ExistingItemHandling,
  rpcMethods,
  MIN_WITH_PARAMS_BASKET,
  type AddOrUpdateItemType,
  type BasketResponseData,
  type BasketWithOptions,
  type Product,
  type RpcContext,
  type RpcHandler,
  type Variant,
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
      // important to prevent BAPI from bundling additional services as one product with x-quantity
      considerItemGroupForUniqueness: true,
    },
    context,
  )
}
