import type { Product, BuyXGetYEffect } from '@scayle/storefront-nuxt'

export default async (product: Product) => {
  const { buyXGetYPromotion, hasBuyXGetY } = await useProductPromotions(product)

  const variantIds = computed(() => {
    const { additionalData } = buyXGetYPromotion.value?.effect as BuyXGetYEffect
    return additionalData.variantIds.slice(0, additionalData.maxCount)
  })

  const backgroundColorStyle = computed(() => {
    return getBackgroundColorStyle(buyXGetYPromotion.value?.customData.colorHex)
  })

  const hasMultipleFreeGifts = computed(() => {
    if (!hasBuyXGetY.value) {
      return false
    }
    const effect = buyXGetYPromotion.value?.effect as BuyXGetYEffect
    return effect.additionalData.variantIds.length > 1
  })

  const { data: variants } = await useVariant({
    params: { ids: variantIds.value },
    key: `promotion-variants-${buyXGetYPromotion.value?.id}`,
  })

  const { data: products } = await useProductsByIds({
    params: { ids: variants.value.map((it) => it.productId) },
  })

  const variantsWithProducts = computed(() => {
    return variants.value.map((variant) => ({
      ...variant,
      product: products.value.find((it) => it.id === variant.productId),
    })) as VariantWithProduct[]
  })

  return {
    variantsWithProducts,
    backgroundColorStyle,
    hasMultipleFreeGifts,
  }
}
