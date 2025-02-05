import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed } from 'vue'
import type { BasketItem, Price } from '@scayle/storefront-nuxt'
import { toRef } from '@vueuse/core'
import type { AppliedReduction } from '@scayle/storefront-core'
import { useFormatHelpers } from '#storefront/composables'

type RelativeReductions = {
  value: number
  category: 'promotion' | 'sale' | 'campaign' | 'voucher'
}

export type BasketItemPrice = BasketItem['price']['total']

export interface UseProductPriceReturn {
  /** Ordered applied reductions */
  appliedReductions: ComputedRef<AppliedReduction[]>
  /** Formatted strike through prices */
  strikeThroughPrices: ComputedRef<string[]>
  /** Reductions representing the relative amount and their respective categories. */
  relativeReductions: ComputedRef<RelativeReductions[]>
  /** Formatted total price. */
  totalPrice: ComputedRef<string>
}

/**
 * Composable for extracted product price data.
 *
 * @param _price - Product or basket item price object containing all price relevant data.
 * @returns An {@link UseProductPriceReturn} object containing product price reactive data.
 */
export function useProductPrice(
  _price: MaybeRefOrGetter<Price | BasketItemPrice>,
): UseProductPriceReturn {
  const { formatCurrency } = useFormatHelpers()

  const price = toRef(_price)

  const appliedReductions = computed(() => {
    const reductions = price.value.appliedReductions ?? []
    return reductions.toReversed()
  })

  const strikeThroughPrices = computed(() => {
    return appliedReductions.value.reduce<{
      prices: string[]
      currentPrice: number
    }>(
      ({ prices, currentPrice }, { amount }) => {
        currentPrice += amount.absoluteWithTax
        return {
          currentPrice,
          prices: [...prices, formatCurrency(currentPrice)],
        }
      },
      {
        prices: [],
        currentPrice: price.value.withTax,
      },
    ).prices
  })

  const relativeReductions = computed<RelativeReductions[]>(() =>
    appliedReductions.value.map(({ amount, category }) => {
      return { value: Math.round(amount.relative * 100), category }
    }),
  )

  const totalPrice = computed(() => {
    return formatCurrency(price.value.withTax)
  })

  return {
    appliedReductions,
    strikeThroughPrices,
    relativeReductions,
    totalPrice,
  }
}
