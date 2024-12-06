import {
  type RpcHandler,
  type RpcContext,
  rpcMethods,
  type Product,
  unwrap,
} from '@scayle/storefront-nuxt'

export const getPromotionGiftProducts: RpcHandler<
  { variantIds: number[] },
  Product[]
> = async function getPromotionGiftProducts(
  { variantIds },
  context: RpcContext,
) {
  const variantDetails = await unwrap(
    rpcMethods.getVariantById({ ids: variantIds }, context),
  )

  const uniqueProducts = await unwrap(
    rpcMethods.getProductsByIds(
      {
        ids: variantDetails.map(({ productId }) => productId),
      },
      context,
    ),
  )

  return uniqueProducts
    .filter(({ isActive }) => isActive)
    .map((product) => {
      return {
        ...product,
        variants: product.variants?.filter(({ id }) => {
          return variantIds.includes(id)
        }),
      }
    })
}
