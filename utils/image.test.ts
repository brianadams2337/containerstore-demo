import { it, describe } from 'vitest'
import type { ProductImage } from '@scayle/storefront-nuxt'
import { getPrimaryImage } from './image'

describe('getPrimaryImage', () => {
  it('returns primary image if there is "primaryImage" attribute', ({
    expect,
  }) => {
    const images: ProductImage[] = [
      {
        hash: 'images/fe8ee645c772b98de23b00e4f600a613.png',
        attributes: {
          primaryImage: {
            id: 7061,
            key: 'primaryImage',
            label: 'Primary Image',
            multiSelect: false,
            type: '',
            values: {
              id: 2433,
              label: 'true',
              value: 'true',
            },
          },
        },
      },
    ]

    const image = getPrimaryImage(images)

    expect(image).toEqual({
      hash: 'images/fe8ee645c772b98de23b00e4f600a613.png',
      attributes: {
        primaryImage: {
          id: 7061,
          key: 'primaryImage',
          label: 'Primary Image',
          multiSelect: false,
          type: '',
          values: {
            id: 2433,
            label: 'true',
            value: 'true',
          },
        },
      },
    })
  })

  it('returns undefined if there is no "primaryImage" attribute', ({
    expect,
  }) => {
    const images: ProductImage[] = [
      {
        hash: 'images/fe8ee645c772b98de23b00e4f600a613.png',
        attributes: {},
      },
    ]

    const image = getPrimaryImage(images)
    expect(image).toEqual(undefined)
  })
})
