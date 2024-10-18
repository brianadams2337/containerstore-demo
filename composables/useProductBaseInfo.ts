import {
  type Product,
  getFirstAttributeValue,
  getProductAndSiblingsColors,
} from '@scayle/storefront-nuxt'
import { type MaybeRefOrGetter, toRef, computed } from 'vue'
import { useRouteHelpers } from '~/composables'
import {
  getLowestPriceBetweenVariants,
  getVariantWithLowestPrice,
  formatColors,
  getProductSiblings,
  sortProductImages,
  getPrimaryImage,
} from '~/utils'
import { useI18n } from '#i18n'
import type { ProductSibling } from '~/types/siblings'

export function useProductBaseInfo(
  productItem: MaybeRefOrGetter<Product | undefined | null>,
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

  const description = computed(() => {
    return (
      getFirstAttributeValue(product.value?.attributes, 'description')?.label ??
      ''
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

  const images = computed(() => {
    if (!product.value) {
      return []
    }

    return sortProductImages(product.value.images)
  })

  const image = computed(() => {
    if (!product.value) {
      return
    }

    return getPrimaryImage(product.value.images)
  })

  const siblings = computed<ProductSibling[]>(() => {
    return getProductSiblings(product.value, 'color', { sortBySoldOut: true })
  })

  const nonSoldOutSiblings = computed<ProductSibling[]>(() => {
    return getProductSiblings(product.value, 'color', { omitSoldOut: true })
  })

  const link = computed(() => {
    return product.value
      ? getProductDetailRoute(product.value.id, name.value)
      : undefined
  })

  const alt = computed(() => {
    return t('product_image.alt', {
      productName: name.value,
      colors: formatColors(colors.value),
      brand: brand.value,
    })
  })

  const longestCategoryList = computed(() => {
    if (
      !product.value ||
      !product.value.categories ||
      product.value.categories.length === 0
    ) {
      return []
    }

    return product.value.categories.reduce(
      (longestArray, currentArray) =>
        currentArray.length > longestArray.length ? currentArray : longestArray,
      [],
    )
  })

  const variants = computed(() => product.value?.variants || [])
  const hasOneVariantOnly = computed(() => {
    return variants.value.length === 1
  })

  return {
    alt,
    brand,
    name,
    description,
    price,
    lowestPriorPrice,
    colors,
    image,
    images,
    siblings,
    nonSoldOutSiblings,
    link,
    variantWithLowestPrice,
    longestCategoryList,
    variants,
    hasOneVariantOnly,
  }
}
