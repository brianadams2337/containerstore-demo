import { computed, type Ref } from 'vue'
import type { Price } from '@scayle/storefront-nuxt'
import { useFormatHelpers } from '#storefront/composables'

type RelativeReductions = {
  value: number
  category: 'promotion' | 'sale' | 'campaign' | 'voucher'
}

export function useProductPrice(price: Ref<Price>) {
  const { formatCurrency } = useFormatHelpers()

  const appliedReductions = computed(() => {
    const reductions = price.value.appliedReductions ?? []
    return reductions.toReversed()
  })

  const strikeThroughPrices = computed(() => {
    let currentPrice = price.value.withTax as number

    return appliedReductions.value.map(({ amount }) => {
      currentPrice += amount.absoluteWithTax
      return formatCurrency(currentPrice)
    })
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
