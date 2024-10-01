import { it, describe, expect } from 'vitest'
import type { AttributeGroupSingle } from '@scayle/storefront-nuxt'
import { getPrimaryImage, sortProductImages } from './image'

const primaryImage: AttributeGroupSingle = {
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
}

describe('getPrimaryImage', () => {
  it('returns the first primary image', () => {
    const image = getPrimaryImage([
      {
        hash: 'hash1',
      },
      {
        hash: 'hash2',
        attributes: {
          primaryImage,
        },
      },
      {
        hash: 'hash3',
      },
    ])

    expect(image).toEqual({
      hash: 'hash2',
      attributes: {
        primaryImage,
      },
    })
  })

  it('returns the first image if no primary image exists', () => {
    const image = getPrimaryImage([
      {
        hash: 'hash1',
      },
      {
        hash: 'hash2',
      },
      {
        hash: 'hash3',
      },
    ])

    expect(image).toEqual({ hash: 'hash1' })
  })
})

describe('getSortedImages', () => {
  it('should not change the sorting if no primary image exists', () => {
    const images = sortProductImages([
      {
        hash: 'hash1',
      },
      {
        hash: 'hash2',
      },
      {
        hash: 'hash3',
      },
    ])

    expect(images).toStrictEqual([
      {
        hash: 'hash1',
      },
      {
        hash: 'hash2',
      },
      {
        hash: 'hash3',
      },
    ])
  })

  it('should sort primary images to the front', () => {
    const images = sortProductImages([
      {
        hash: 'hash1',
      },
      {
        hash: 'hash2',
        attributes: {
          primaryImage,
        },
      },
      {
        hash: 'hash3',
      },
    ])

    expect(images).toStrictEqual([
      {
        hash: 'hash2',
        attributes: {
          primaryImage,
        },
      },
      {
        hash: 'hash1',
      },
      {
        hash: 'hash3',
      },
    ])
  })

  it('should handle images with multiple primary images', () => {
    const images = sortProductImages([
      {
        hash: 'hash1',
      },
      {
        hash: 'hash2',
        attributes: {
          primaryImage,
        },
      },
      {
        hash: 'hash3',
      },
      {
        hash: 'hash4',
        attributes: {
          primaryImage,
        },
      },
    ])

    expect(images).toStrictEqual([
      {
        hash: 'hash2',
        attributes: {
          primaryImage,
        },
      },
      {
        hash: 'hash4',
        attributes: {
          primaryImage,
        },
      },
      {
        hash: 'hash1',
      },
      {
        hash: 'hash3',
      },
    ])
  })
})
