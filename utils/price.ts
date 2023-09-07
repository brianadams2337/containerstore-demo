export const getShippingNetFee = (appliedFees: any[]): any | null => {
  if (!appliedFees.length) {
    return null
  }

  const shippingNetFees = appliedFees?.filter(
    (fee) => fee.category === 'delivery',
  )
  let totalShippingNetFee = 0
  shippingNetFees?.forEach(
    (fee) => (totalShippingNetFee += fee.amount.withoutTax),
  )
  return totalShippingNetFee
}
export default {
  getShippingNetFee,
}
