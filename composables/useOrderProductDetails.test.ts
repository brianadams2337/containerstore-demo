import { describe, it, expect, vi } from 'vitest'
import { useOrderProductDetails } from './useOrderProductDetails'
import {
  orderProductFactory,
  orderVariantFactory,
  attributeSingleGroupFactory,
} from '~/test/factories/order'

vi.mock('#i18n', () => ({
  useI18n: vi.fn().mockReturnValue({
    t: (
      key: string,
      param: { productName: string; colors: string; brand: string },
    ) => `${key}-${param.brand}-${param.productName}-${param.colors}`,
  }),
}))

vi.mock('~/composables', () => ({
  useRouteHelpers: vi.fn().mockReturnValue({
    getProductDetailRoute: (id: number) => id,
  }),
}))

describe('useOrderProductDetails', () => {
  describe('brand', () => {
    it('should return the correct value for brand', () => {
      const product = orderProductFactory.build({
        attributes: {
          brand: attributeSingleGroupFactory.build({
            key: 'brand',
            label: 'Brand',
            type: 'string',
            values: {
              label: 'Brand Name',
              id: 101,
              value: 'brand-name',
            },
          }),
        },
      })
      const { brand } = useOrderProductDetails(
        () => product,
        () => orderVariantFactory.build(),
      )

      expect(brand.value).toBe('Brand Name')
    })

    it('should return empty value for brand', () => {
      const product = orderProductFactory.build({
        attributes: {
          brand: attributeSingleGroupFactory.build({
            values: undefined,
          }),
        },
      })
      const { brand } = useOrderProductDetails(
        () => product,
        () => orderVariantFactory.build(),
      )

      expect(brand.value).toBeUndefined()
    })
  })

  describe('name', () => {
    it('should return the correct value for name', () => {
      const product = orderProductFactory.build({ name: 'Test Product' })
      const { name } = useOrderProductDetails(
        () => product,
        () => orderVariantFactory.build(),
      )

      expect(name.value).toBe('Test Product')
    })
  })

  describe('lowestPriorPrice', () => {
    it('should return the correct value for lowestPriorPrice', () => {
      const variant = orderVariantFactory.build({
        lowestPriorPrice: {
          withTax: 23,
          relativeDifferenceToPrice: 0.11,
        },
      })
      const { lowestPriorPrice } = useOrderProductDetails(
        () => orderProductFactory.build(),
        () => variant,
      )

      expect(lowestPriorPrice.value).toStrictEqual({
        relativeDifferenceToPrice: 0.11,
        withTax: 23,
      })
    })

    it('should return undefined value for lowestPriorPrice', () => {
      const variant = orderVariantFactory.build({ lowestPriorPrice: undefined })

      const { lowestPriorPrice } = useOrderProductDetails(
        () => orderProductFactory.build(),
        () => variant,
      )

      expect(lowestPriorPrice.value).toBeUndefined()
    })
  })

  describe('color', () => {
    it('should return the correct color value', () => {
      const product = orderProductFactory.build({
        attributes: {
          color: attributeSingleGroupFactory.build({
            key: 'color',
            label: 'Color',
            type: '',
            values: {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          }),
        },
      })
      const { color } = useOrderProductDetails(
        () => product,
        () => orderVariantFactory.build(),
      )

      expect(color.value).toEqual('Weiß')
    })

    it('should return undefined value for color', () => {
      const product = orderProductFactory.build({
        attributes: {
          color: attributeSingleGroupFactory.build({
            values: undefined,
          }),
        },
      })
      const { color } = useOrderProductDetails(
        () => product,
        () => orderVariantFactory.build(),
      )

      expect(color.value).toBeUndefined()
    })
  })

  describe('image', () => {
    it('should return first image from product images', () => {
      const product = orderProductFactory.build({
        images: [
          {
            hash: 'hash1',
          },
        ],
      })
      const { image } = useOrderProductDetails(
        () => product,
        () => orderVariantFactory.build(),
      )

      expect(image.value).toStrictEqual({
        hash: 'hash1',
      })
    })
  })

  describe('link', () => {
    it('should return the correct value for link', () => {
      const product = orderProductFactory.build({ name: 'Test Product' })
      const { link } = useOrderProductDetails(
        () => product,
        () => orderVariantFactory.build(),
      )

      expect(link.value).toEqual(1)
    })
  })
  describe('alt', () => {
    it('should return the correct value for alt', () => {
      const product = orderProductFactory.build({
        name: 'Test Product',
        attributes: {
          brand: attributeSingleGroupFactory.build({
            key: 'brand',
            label: 'Brand',
            type: 'string',
            values: {
              label: 'Brand Name',
              id: 101,
              value: 'brand-name',
            },
          }),
          color: attributeSingleGroupFactory.build({
            key: 'color',
            label: 'Color',
            type: '',
            values: {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          }),
        },
      })
      const { alt } = useOrderProductDetails(
        () => product,
        () => orderVariantFactory.build(),
      )

      expect(alt.value).toEqual(
        'product_image.alt-Brand Name-Test Product-Weiß',
      )
    })
  })
})
