import type { RpcHandler, RpcContext } from '@scayle/storefront-nuxt'

export * from './basketGroup'

export const getShopId: RpcHandler<{ shop: number }> = (
  context: RpcContext,
) => {
  return {
    shop: context.shopId,
  }
}
