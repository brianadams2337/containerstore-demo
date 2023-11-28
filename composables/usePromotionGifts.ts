import type { Product, BuyXGetYEffect } from '@scayle/storefront-nuxt'

export default async (product: Product) => {
  const { buyXGetYPromotion, hasBuyXGetY } = await useProductPromotions(product)

  const variantIds = computed(() => {
    const effect = buyXGetYPromotion.value?.effect as BuyXGetYEffect
    return effect?.additionalData?.variantIds?.slice(
      0,
      effect?.additionalData?.maxCount,
    )
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

  const { data } = await useProductsByIds({
    params: { ids: variants.value?.map((it) => it.productId) },
  })

  const products = computed(() => {
    const items = useUnique(data.value || [], (it) => it.id)
    return items.map((it) => {
      const filteredVariants = it.variants?.filter(({ id }) => {
        return variantIds.value.includes(id)
      })
      return { ...it, variants: filteredVariants }
    })
  })

  return {
    variantIds,
    products,
    backgroundColorStyle,
    hasMultipleFreeGifts,
  }
}
