import type { Product } from '@scayle/storefront-nuxt'
import { unique } from 'radash'

export async function usePromotionGifts(product: Product) {
  const app = useNuxtApp()

  const [basketData, { buyXGetYPromotion }] = await Promise.all([
    useBasket(),
    useProductPromotions(product),
  ])

  const variantIds = computed(() => getVariantIds(buyXGetYPromotion.value))

  const isGiftAlreadyAdded = computed(() => {
    return (basketData.data.value?.items ?? []).some((item) => {
      const isGift = variantIds.value?.includes(item.variant.id)
      return (
        isGift &&
        item.promotionId &&
        isBuyXGetYType(item.promotion) &&
        item.promotionId === buyXGetYPromotion.value?.id
      )
    })
  })

  const backgroundColorStyle = computed(() => {
    return getBackgroundColorStyle(buyXGetYPromotion.value?.customData.colorHex)
  })

  const hasMultipleFreeGifts = computed(() => variantIds.value.length > 1)

  const { data: variants } = await app.runWithContext(() =>
    useVariant({
      params: { ids: variantIds.value },
      key: `promotion-variants-${buyXGetYPromotion.value?.id}`,
    }),
  )

  const { data: productsData } = await app.runWithContext(() =>
    useProductsByIds({
      params: { ids: variants.value?.map(({ productId }) => productId) ?? [] },
      key: `promotion-products-${buyXGetYPromotion.value?.id}`,
    }),
  )

  const products = computed(() => {
    const items = unique(productsData.value || [], ({ id }) => id)
    return items.map((item) => {
      const filteredVariants = item.variants?.filter(({ id }) => {
        return variantIds.value.includes(id)
      })
      return { ...item, variants: filteredVariants }
    })
  })

  return {
    variantIds,
    products,
    backgroundColorStyle,
    hasMultipleFreeGifts,
    isGiftAlreadyAdded,
  }
}
