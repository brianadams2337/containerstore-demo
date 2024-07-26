import {
  type Product,
  getFirstAttributeValue,
  getProductAndSiblingsColors,
  ProductImageType,
  getImageFromList,
  type ProductSibling,
} from '@scayle/storefront-nuxt'
import { type MaybeRefOrGetter, toRef, computed } from 'vue'
import { useRouteHelpers } from './useRouteHelpers'
import { getProductSiblings } from '~/utils/product'
import {
  getLowestPriceBetweenVariants,
  getVariantWithLowestPrice,
} from '~/utils'

export function useProductBaseInfo(
  productItem: MaybeRefOrGetter<Product | undefined>,
) {
  const product = toRef(productItem)
  const { getProductDetailRoute } = useRouteHelpers()

  const brand = computed(() => {
    return (
      getFirstAttributeValue(product.value?.attributes, 'brand')?.label ?? ''
    )
  })

  const name = computed(() => {
    return (
      getFirstAttributeValue(product.value?.attributes, 'name')?.label ?? ''
    )
  })

  const price = computed(() => {
    if (!product.value) {
      return
    }
    return getLowestPriceBetweenVariants(product.value)
  })

  const variantWithLowestPrice = computed(() =>
    getVariantWithLowestPrice(product.value?.variants || []),
  )

  const lowestPriorPrice = computed(() => {
    return variantWithLowestPrice.value?.lowestPriorPrice
  })

  const colors = computed(() => {
    if (!product.value) {
      return
    }
    return getProductAndSiblingsColors(product.value, 'color')
  })

  const image = computed(() => {
    if (!product.value) {
      return
    }
    return getImageFromList(
      product.value.images,
      ProductImageType.BUST,
      'front',
    )
  })

  const siblings = computed<ProductSibling[]>(() => {
    return getProductSiblings(product.value, 'color')
  })

  const nonSoldOutSiblings = computed<ProductSibling[]>(() => {
    return getProductSiblings(product.value, 'color', { omitSoldOut: true })
  })

  const link = computed(() => {
    return product.value ? getProductDetailRoute(product.value) : undefined
  })

  return {
    brand,
    name,
    price,
    lowestPriorPrice,
    colors,
    image,
    siblings,
    nonSoldOutSiblings,
    link,
    variantWithLowestPrice,
  }
}
