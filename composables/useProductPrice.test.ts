import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import type { CentAmount } from '@scayle/storefront-nuxt'
import { useProductPrice } from './useProductPrice'
import { priceFactory } from '~/test/factories/price'

vi.mock('#storefront/composables', () => ({
  useFormatHelpers: () => ({
    formatCurrency: vi.fn((value) => `$${value.toFixed(2)}`),
  }),
}))

vi.mock('@scayle/storefront-nuxt', () => ({
  getTotalAppliedReductions: vi.fn(),
}))

describe('useProductPrice', () => {
  it('should calculate applied reductions correctly', () => {
    const price = ref(
      priceFactory.build({
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
      }),
    )
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
    const price = ref(
      priceFactory.build({
        appliedReductions: [],
      }),
    )
    const { appliedReductions, relativeReductions } = useProductPrice(price)

    expect(appliedReductions.value).toEqual([])
    expect(relativeReductions.value).toEqual([])
  })
})
