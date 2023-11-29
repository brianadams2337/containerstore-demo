import type { Product } from '@scayle/storefront-nuxt'

export default async (product: Product) => {
  const { buyXGetYPromotion } = await useProductPromotions(product)

  const variantIds = computed(() => getVariantIds(buyXGetYPromotion.value))

  const backgroundColorStyle = computed(() => {
    return getBackgroundColorStyle(buyXGetYPromotion.value?.customData.colorHex)
  })

  const hasMultipleFreeGifts = computed(() => variantIds.value.length > 1)

  const { data: variants } = await useVariant({
    params: { ids: variantIds.value },
    key: `promotion-variants-${buyXGetYPromotion.value?.id}`,
  })

  const { data } = await useProductsByIds({
    params: { ids: variants.value?.map((it) => it.productId) },
    key: `promotion-products-${buyXGetYPromotion.value?.id}`,
  })

  const products = computed(() => {
    const items = useUnique(data.value, (it) => it.id)
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
