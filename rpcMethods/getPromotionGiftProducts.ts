import {
  type RpcHandler,
  type RpcContext,
  rpcMethods,
  type Product,
} from '@scayle/storefront-core'

export const getPromotionGiftProducts: RpcHandler<
  { variantIds: number[] },
  Product[]
> = async function getPromotionGiftProducts(
  { variantIds },
  context: RpcContext,
) {
  const variantDetails = await rpcMethods.getVariantById(
    { ids: variantIds },
    context,
  )

  const uniqueProducts = await rpcMethods.getProductsByIds(
    {
      ids: variantDetails.map(({ productId }) => productId),
    },
    context,
  )

  return uniqueProducts.map((product) => {
    const filteredVariants = product.variants?.filter(({ id }) => {
      return variantIds.includes(id)
    })
    return { ...product, variants: filteredVariants }
  })
}
