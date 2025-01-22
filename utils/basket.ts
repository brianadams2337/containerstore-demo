import {
  type AppliedReduction,
  type BasketResponseData,
  type BasketTotalPrice,
  AddToBasketFailureKind,
} from '@scayle/storefront-nuxt'

/**
 * Returns a translation key for a basket error message based on the provided error.
 *
 * @param error - The error to determine the error message key for
 * @returns The translation key corresponding to the error type
 */
export const getBasketToastErrorMessageKey = (error: unknown) => {
  if (error instanceof Error) {
    if (error.cause === AddToBasketFailureKind.ItemAddedWithReducedQuantity) {
      return 'basket.notification.add_with_reduced_quantity_error'
    } else if (error.cause === AddToBasketFailureKind.ItemUnvailable) {
      return 'basket.notification.add_to_basket_variant_out_of_stock_error'
    } else if (error.cause === AddToBasketFailureKind.MaximumItemCountReached) {
      return 'basket.notification.add_to_basket_max_basket_items_error'
    }
  }
  return 'basket.notification.add_to_basket_error'
}

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
 * @param {BasketTotalPrice} cost - The basket total price object.
 * @returns {number} - The total original price value without reductions
 */
export const getTotalPriceWithoutReductions = (
  cost: BasketTotalPrice,
): number => {
  return cost.appliedReductions.reduce(
    (total, { amount }) => total + amount.absoluteWithTax,
    +cost.withTax,
  )
}
