import type { RpcContext, RpcHandler } from '@scayle/storefront-nuxt'

export const getCampaignKey: RpcHandler<string | undefined> = (
  context: RpcContext,
) => {
  return context.campaignKey
}
