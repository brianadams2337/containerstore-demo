import { it, describe, expect } from 'vitest'
import { hasOneSizeProductVariantOnly } from './sizes'
import { variantFactory } from '~/test/factories/variant'
import { productFactory } from '~/test/factories/product'

describe('hasOneSizeProductVariantOnly', () => {
  it('should return false for product variant with more than one size', () => {
    const product = productFactory.build({
      variants: [
        variantFactory.build({
          attributes: {
            size: {
              id: 1001,
              key: 'size',
              label: 'Größe',
              type: 'size',
              multiSelect: false,
              values: {
                id: 2312,
                label: '1',
                value: '1',
              },
            },
          },
        }),
      ],
    })

    const result = hasOneSizeProductVariantOnly(product)

    expect(result).toBe(false)
  })

  it('should return true for product variant with only a single size', () => {
    const product = productFactory.build({
      variants: [
        variantFactory.build({
          attributes: {
            size: {
              id: 1001,
              key: 'size',
              label: 'Größe',
              type: 'size',
              multiSelect: false,
              values: {
                id: 2312,
                label: 'One Size',
                value: 'one_size',
              },
            },
          },
        }),
      ],
    })
    const result = hasOneSizeProductVariantOnly(product)

    expect(result).toBe(true)
  })
})
