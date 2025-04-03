import {
  type Promotion,
  type Product,
  extendPromise,
} from '@scayle/storefront-nuxt'
import { type MaybeRefOrGetter, computed, type ComputedRef } from 'vue'
import { toRef } from '@vueuse/core'
import { useBasket, useCurrentPromotions } from '#storefront/composables'
import {
  getVariantIds,
  isBuyXGetYType,
  isGiftConditionMet,
} from '#storefront-promotions/utils'
import { getPromotionForProduct } from '~/utils'

type UseProductPromotionsReturn = {
  /** A computed ref holding the promotion which is connected to the passed product. `undefined` when no Promotion is connected to the passed product. */
  promotion: ComputedRef<Promotion | undefined>
  /** A computed ref that indicates whether a promotion gift is added to basket or not. */
  isGiftAddedToBasket: ComputedRef<boolean>
  /** A computed ref that indicates whether a promotion gift conditions are met or not */
  areGiftConditionsMet: ComputedRef<boolean>
}

/**
 * Composable for extracted product promotions data.
 *
 * @param productItem - Product on which promotions will be extracted
 * @returns An {@link UseProductPromotionsReturn} object containing reactive product promotion data.
 */
export function useProductPromotions(
  productItem?: MaybeRefOrGetter<Product | undefined | null>,
): UseProductPromotionsReturn & Promise<UseProductPromotionsReturn> {
  const basket = useBasket()
  const promotionData = useCurrentPromotions()

  const product = toRef(productItem)

  const promotions = computed<Promotion[]>(() => {
    return promotionData.data?.value?.entities ?? []
  })

  const promotion = computed(() => {
    if (!product.value || !promotions.value.length) {
      return undefined
    }

    return getPromotionForProduct(product.value, promotions.value)
  })

  const areGiftConditionsMet = computed(() => {
    if (!promotion.value || !basket.data.value?.applicablePromotions?.length) {
      return false
    }
    return isGiftConditionMet(
      promotion.value,
      basket.data.value?.applicablePromotions,
    )
  })

  const isGiftAddedToBasket = computed(() => {
    if (!isBuyXGetYType(promotion.value)) {
      return false
    }
    return (
      basket.items.value?.some(({ promotion: basketPromotion, variant }) => {
        const variantIds = getVariantIds(promotion.value)
        const hasVariantId = variantIds.includes(variant.id)
        return (
          isBuyXGetYType(basketPromotion) &&
          hasVariantId &&
          promotion.value?.id === basketPromotion?.id
        )
      }) || false
    )
  })

  return extendPromise(
    Promise.all([basket, promotionData]).then(() => ({})),
    {
      promotion,
      isGiftAddedToBasket,
      areGiftConditionsMet,
    },
  )
}
