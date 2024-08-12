import {
  type Product,
  getFirstAttributeValue,
  getProductAndSiblingsColors,
} from '@scayle/storefront-nuxt'
import { type MaybeRefOrGetter, toRef, computed } from 'vue'
import { useRouteHelpers } from '~/composables'
import {
  getLowestPriceBetweenVariants,
  getPrimaryImage,
  getVariantWithLowestPrice,
  formatColors,
  getProductSiblings,
} from '~/utils'
import { useI18n } from '#i18n'
import type { ProductSibling } from '~/types/siblings'

export function useProductBaseInfo(
  productItem: MaybeRefOrGetter<Product | undefined>,
) {
  const product = toRef(productItem)
  const { getProductDetailRoute } = useRouteHelpers()

  const { t } = useI18n()

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
    return product.value
      ? getLowestPriceBetweenVariants(product.value)
      : undefined
  })

  const variantWithLowestPrice = computed(() =>
    getVariantWithLowestPrice(product.value?.variants || []),
  )

  const lowestPriorPrice = computed(() => {
    return variantWithLowestPrice.value?.lowestPriorPrice
  })

  const colors = computed(() => {
    return product.value
      ? getProductAndSiblingsColors(product.value, 'color')
      : undefined
  })

  const image = computed(() => {
    if (!product.value) return
    return getPrimaryImage(product.value.images) ?? product.value.images[0]
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

  const alt = computed(() => {
    return t('product_image.alt', {
      productName: name.value,
      colors: formatColors(colors.value),
    })
  })

  return {
    alt,
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
