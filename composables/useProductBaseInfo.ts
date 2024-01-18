import {
  type Product,
  getFirstAttributeValue,
  getProductAndSiblingsColors,
  getProductSiblings,
} from '@scayle/storefront-nuxt'

export function useProductBaseInfo(productItem: MaybeRefOrGetter<Product>) {
  const product = toRef(productItem)
  const { getProductDetailRoute } = useRouteHelpers()

  const brand = computed(() => {
    return getFirstAttributeValue(product.value.attributes, 'brand')?.label
  })

  const name = computed(() => {
    return getFirstAttributeValue(product.value.attributes, 'name')?.label ?? ''
  })

  const price = computed(() => {
    return getLowestPriceBetweenVariants(product.value)
  })

  const variantWithLowestPrice = computed(() =>
    getVariantWithLowestPrice(product.value?.variants || []),
  )

  const lowestPriorPrice = computed(() => {
    return variantWithLowestPrice.value?.lowestPriorPrice
  })

  const colors = computed(() => {
    return getProductAndSiblingsColors(product.value, 'color')
  })

  const image = computed(() => {
    return getImageFromList(
      product.value.images,
      ProductImageType.BUST,
      'front',
    )
  })

  const siblings = computed(() => {
    return getProductSiblings(product.value, 'color') || []
  })

  const link = computed(() => getProductDetailRoute(product.value))

  return {
    brand,
    name,
    price,
    lowestPriorPrice,
    colors,
    image,
    siblings,
    link,
    variantWithLowestPrice,
  }
}
