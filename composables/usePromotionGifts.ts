import { type Product, extendPromise } from '@scayle/storefront-nuxt'
import { computed, type Ref } from 'vue'
import { useBasket, useRpc } from '#storefront/composables'
import { getBackgroundColorStyle, getVariantIds, isBuyXGetYType } from '~/utils'
import type { Promotion } from '~/types/promotion'

export function usePromotionGifts(
  product: Product,
  buyXGetYPromotion: Ref<Promotion | null | undefined>,
  key?: string,
) {
  if (!key) {
    // The key is auto-added so this will only be thrown if a nullish value is passed to the function
    throw Error('missing key argument')
  }

  const basketData = useBasket()

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

  const getFreeGiftProducts = useRpc(
    'getPromotionGiftProducts',
    key ?? `promotion-gifts-${key}-${product.id}`,
    () => ({ variantIds: variantIds.value }),
  )

  const { data: products } = getFreeGiftProducts
  return extendPromise(
    Promise.all([basketData, getFreeGiftProducts]).then(() => ({})),
    {
      variantIds,
      products,
      backgroundColorStyle,
      hasMultipleFreeGifts,
      isGiftAlreadyAdded,
    },
  )
}
