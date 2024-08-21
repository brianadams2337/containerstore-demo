import { describe, it, expect, vi, beforeEach } from 'vitest'
import { type Ref, ref } from 'vue'
import type { Price, CentAmount } from '@scayle/storefront-nuxt'
import { useProductPrice } from './useProductPrice'

vi.mock('#storefront/composables', () => ({
  useFormatHelpers: () => ({
    formatCurrency: vi.fn((value) => `$${value.toFixed(2)}`),
  }),
}))

vi.mock('@scayle/storefront-nuxt', () => ({
  getTotalAppliedReductions: vi.fn(),
}))

describe('useProductPrice', () => {
  const price = ref({
    withTax: 100,
    appliedReductions: [
      { amount: { absoluteWithTax: 10, relative: 0.1 }, category: 'sale' },
      { amount: { absoluteWithTax: 5, relative: 0.05 }, category: 'promotion' },
    ],
  }) as Ref<Price>

  beforeEach(() => {
    price.value = {
      currencyCode: '',
      tax: { vat: { amount: 1 as CentAmount, rate: 0 } },
      withoutTax: 2 as CentAmount,
      withTax: 100 as CentAmount,
      appliedReductions: [
        {
          amount: { absoluteWithTax: 10 as CentAmount, relative: 0.1 },
          category: 'sale',
          type: 'relative',
        },
        {
          amount: { absoluteWithTax: 5 as CentAmount, relative: 0.05 },
          category: 'promotion',
          type: 'relative',
        },
      ],
    }
  })

  it('should calculate applied reductions correctly', () => {
    const {
      appliedReductions,
      relativeReductions,
      strikeThroughPrices,
      totalPrice,
    } = useProductPrice(price)

    expect(appliedReductions.value).toEqual([
      {
        amount: { absoluteWithTax: 5, relative: 0.05 },
        category: 'promotion',
        type: 'relative',
      },
      {
        amount: { absoluteWithTax: 10, relative: 0.1 },
        category: 'sale',
        type: 'relative',
      },
    ])

    expect(strikeThroughPrices.value).toStrictEqual(['$105.00', '$115.00'])
    expect(relativeReductions.value).toEqual([
      { value: 5, category: 'promotion' },
      { value: 10, category: 'sale' },
    ])
    expect(totalPrice.value).toEqual('$100.00')
  })

  it('should handle no applied reductions', () => {
    price.value.appliedReductions = []
    const { appliedReductions, relativeReductions } = useProductPrice(price)

    expect(appliedReductions.value).toEqual([])
    expect(relativeReductions.value).toEqual([])
  })
})
