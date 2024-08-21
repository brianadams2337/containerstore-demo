import { computed, type Ref } from 'vue'
import type { Price } from '@scayle/storefront-nuxt'
import { useFormatHelpers } from '#storefront/composables'

export function useProductPrice(price: Ref<Price>) {
  const { formatCurrency } = useFormatHelpers()

  const appliedReductions = computed(() => {
    const reductions = price.value.appliedReductions ?? []
    return reductions.toReversed()
  })

  const strikeThroughPrices = computed(() => {
    let currentPrice = price.value.withTax as number

    return appliedReductions.value.map(({ amount }) =>
      formatCurrency((currentPrice += amount.absoluteWithTax)),
    )
  })

  const relativeReductions = computed(() =>
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
