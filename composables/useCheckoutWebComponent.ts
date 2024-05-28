export type Customer = {
  authentication: { data: any; type: string }
  data: {
    birthDate?: string
    customData?: any
    email: string
    firstName: string
    gender: string
    id: number
    lastName: string
    trackingHash?: string
    publicKey: string
    referenceKey?: string
    title?: string
    type: string
    phone?: { plainText: string }
  }
  flags?: { canUpgradeToFullAccount?: boolean; isGuest: boolean }
  groups: string[]
}

export async function useCheckoutWebComponent() {
  const instance = useNuxtApp()
  const currentShop = useCurrentShop()
  useHead({
    script: [
      {
        key: 'checkout-wc',
        defer: true,
        async: true,
        fetchpriority: 'high',
        src: `${currentShop.value?.checkout.host}/frontend/checkout-wc/js?appId=${currentShop.value?.shopId}`,
      },
    ],
  })

  const { data, fetch: fetchCheckoutToken } = await useRpc(
    'getCheckoutToken',
    'getCheckoutToken',
    undefined,
    { autoFetch: false },
  )
  return instance.runWithContext(() => {
    return {
      fetchCheckoutToken,
      accessToken: computed(() => data.value?.accessToken),
      checkoutJwt: computed(() => data.value?.checkoutJwt),
    }
  })
}
