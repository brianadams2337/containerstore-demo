import {
  ExistingItemHandling,
  rpcMethods,
  type AddOrUpdateItemType,
  type BasketResponseData,
  type BasketWithOptions,
  type Product,
  type RpcContext,
  type RpcHandler,
  type Variant,
} from '@scayle/storefront-nuxt'

export const addGroupToBasket: RpcHandler<
  { items: AddOrUpdateItemType[]; with: BasketWithOptions },
  BasketResponseData<Product, Variant>
> = async function addGroupToBasket(options, context: RpcContext) {
  return await rpcMethods.addItemsToBasket(
    {
      items: options.items,
      existingItemHandling: ExistingItemHandling.KeepExisting,
      with: options.with,
      // important to prevent BAPI from bundling additional services as one product with x-quantity
      considerItemGroupForUniqueness: true,
    },
    context,
  )
}
