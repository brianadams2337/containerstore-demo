import type {
  AppliedReduction,
  BasketResponseData,
  BasketTotalPrice,
} from '@scayle/storefront-nuxt'

/**
 * Calculates the basket total without promotions reductions applied.
 *
 * @param basket - The basket response data to calculate the total.
 * @returns The basket total without promotions reductions applied.
 */
export const getBasketTotalWithoutPromotions = (
  basket?: BasketResponseData,
) => {
  if (!basket) {
    return 0
  }

  const promotionReductionsList = basket.cost.appliedReductions
    .filter(({ category }) => category === 'promotion')
    .map(({ amount }) => amount.absoluteWithTax)

  const promotionReductionsSum = promotionReductionsList.reduce(
    (acc, item) => acc + item,
    0,
  )

  return basket.cost.withTax + promotionReductionsSum
}

/**
 * Calculates the total reductions for a given reduction category.
 *
 * @param cost - The basket total price.
 * @param reductionCategory - The category of the reductions to calculate.
 * @returns The total value of the reductions in the specified category.
 */
export const getTotalReductionsByCategory = (
  cost: BasketTotalPrice,
  reductionCategory: AppliedReduction['category'],
): number => {
  return (cost.appliedReductions ?? []).reduce<number>((price, currentItem) => {
    return currentItem.category === reductionCategory
      ? price + currentItem.amount.absoluteWithTax
      : price
  }, 0)
}

/**
 * Calculates the total original price without reductions.
 *
 * @param cost - The basket total price object.
 * @returns The total original price value without reductions
 */
export const getTotalPriceWithoutReductions = (
  cost: BasketTotalPrice,
): number => {
  return cost.appliedReductions.reduce(
    (total, { amount }) => total + amount.absoluteWithTax,
    +cost.withTax,
  )
}
