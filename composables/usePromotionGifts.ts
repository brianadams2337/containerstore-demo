import { type Product, extendPromise } from '@scayle/storefront-nuxt'
import { unique } from 'radash'

export async function usePromotionGifts(product: Product, key?: string) {
  if (!key) {
    // The key is auto-added so this will only be thrown if a nullish value is passed to the function
    throw Error('missing key argument')
  }

  const basketData = useBasket()
  const productPromotions = useProductPromotions(product)
  const { buyXGetYPromotion } = productPromotions

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

  const { data: variants } = useVariant({
    params: computed(() => ({ ids: variantIds.value })),
    key: `promotion-variants-${key}`,
  })

  const { data: productsData } = useProductsByIds({
    params: computed(() => ({
      ids: variants.value?.map(({ productId }) => productId) ?? [],
    })),
    key: `promotion-products-${key}`,
  })

  const products = computed(() => {
    const items = unique(productsData.value || [], ({ id }) => id)
    return items.map((item) => {
      const filteredVariants = item.variants?.filter(({ id }) => {
        return variantIds.value.includes(id)
      })
      return { ...item, variants: filteredVariants }
    })
  })

  return extendPromise(
    Promise.all([basketData, productPromotions]).then(() => ({})),
    {
      variantIds,
      products,
      backgroundColorStyle,
      hasMultipleFreeGifts,
      isGiftAlreadyAdded,
    },
  )
}
