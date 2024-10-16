import { describe, it, expect } from 'vitest'
import { getShippingNetFee, divideByHundred, type AppliedFees } from './price'

describe('getShippingNetFee', () => {
  it('should return shipping net fee', () => {
    const appliedFees: AppliedFees = [
      {
        amount: {
          withoutTax: 500,
          withTax: 700,
        },
        category: 'delivery',
        key: 'test-key',
        option: 'test-option',
        tax: {
          vat: {
            amount: 500,
            rate: 1,
          },
        },
      },
      {
        amount: {
          withoutTax: 500,
          withTax: 700,
        },
        category: 'delivery',
        key: 'test-key',
        option: 'test-option',
        tax: {
          vat: {
            amount: 500,
            rate: 1,
          },
        },
      },
      {
        amount: {
          withoutTax: 500,
          withTax: 700,
        },
        category: 'payment',
        key: 'test-key',
        option: 'test-option',
        tax: {
          vat: {
            amount: 500,
            rate: 1,
          },
        },
      },
    ]
    const fees = getShippingNetFee(appliedFees)
    expect(fees).toEqual(1000)
  })

  it('should return null if applied fees are empty', () => {
    expect(getShippingNetFee([])).toEqual(null)
  })
})

describe('divideByHundred', () => {
  it('should divide number by hundred', () => {
    expect(divideByHundred(1000)).toEqual(10)
    expect(divideByHundred(-1000)).toEqual(-10)
    expect(divideByHundred(0)).toEqual(0)
  })
})
