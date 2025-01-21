import { computed, type Ref } from 'vue'
import type { BasketItem, Price } from '@scayle/storefront-nuxt'
import { useFormatHelpers } from '#storefront/composables'

type RelativeReductions = {
  value: number
  category: 'promotion' | 'sale' | 'campaign' | 'voucher'
}
export type BasketItemPrice = BasketItem['price']['total']
export function useProductPrice(price: Ref<Price | BasketItemPrice>) {
  const { formatCurrency } = useFormatHelpers()

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
