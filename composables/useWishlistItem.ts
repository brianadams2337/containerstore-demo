import {
  type LowestPriorPrice,
  type Price,
  type Value,
  type WishlistItem,
  getLowestPrice,
  getSizeFromVariant,
} from '@scayle/storefront-nuxt'

export function useWishlistItem(item: Ref<WishlistItem>) {
  const hasOneSizeVariantOnly = computed(() => {
    return hasOneSizeProductVariantOnly(item.value.product)
  })

  const price = computed<Price>(() => {
    return item.value.variant
      ? item.value.variant.price
      : getLowestPrice(item.value.product.variants || [])
  })

  const isAvailable = computed<boolean>(() => item.value.product.isActive)

  const selectedSize = computed<Value | undefined>(() => {
    return item.value.variant && getSizeFromVariant(item.value.variant, 'size')
  })

  const lowestPriorPrice = computed<LowestPriorPrice | undefined>(() => {
    const variants = item.value.product.variants
    const variant = getVariantWithLowestPrice(variants)
    return variant?.lowestPriorPrice
  })

  const sizes = computed(() => getVariantSizes(item.value.product.variants))

  return {
    hasOneSizeVariantOnly,
    price,
    isAvailable,
    selectedSize,
    lowestPriorPrice,
    sizes,
  }
}
