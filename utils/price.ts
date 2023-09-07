import { Order } from '@scayle/storefront-nuxt'

type AppliedFees = Order['cost']['appliedFees']

export const getShippingNetFee = (appliedFees: AppliedFees): number | null => {
  if (!appliedFees?.length) {
    return null
  }

  const shippingNetFees = appliedFees?.filter((fee) => {
    return fee.category === 'delivery'
  })

  return shippingNetFees.reduce((total, fee) => {
    total += fee.amount.withoutTax
    return total
  }, 0)
}
