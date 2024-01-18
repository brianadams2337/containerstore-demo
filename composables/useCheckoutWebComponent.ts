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

export function useCheckoutWebComponent() {
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
}
