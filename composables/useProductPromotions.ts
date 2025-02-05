import {
  type Product,
  getFirstAttributeValue,
  extendPromise,
} from '@scayle/storefront-nuxt'
import { type MaybeRefOrGetter, computed, type ComputedRef } from 'vue'
import { toRef } from '@vueuse/core'
import { useBasketPromotions } from '~/composables/useBasketPromotions'
import { useBasket, useCurrentPromotions } from '#storefront/composables'
import type { Promotion } from '~/types/promotion'
import {
  getApplicablePromotionsForProduct,
  getVariantIds,
  isBuyXGetYType,
} from '~/utils'

type UseProductPromotionsReturn = {
  /** The promotion ID within the product promotion attributes, representing the link between the product and the promotion.*/
  productPromotionId: ComputedRef<number | undefined>
  /** All applicable promotions */
  applicablePromotions: ComputedRef<Promotion[]>
  /** Reactive promotion data */
  promotion: ComputedRef<Promotion | undefined>
  /** A computed ref that indicates whether a promotion is applied or not. */
  isPromotionApplied: ComputedRef<boolean>
  /** A computed ref that indicates whether a promotion gift is added to basket or not. */
  isGiftAddedToBasket: ComputedRef<boolean>
  /** A computed ref that indicates whether a promotion gift conditions are met or not */
  areGiftConditionsMet: ComputedRef<boolean>
  /** A computed ref that indicates whether "Hurry to save" banners are shown or not */
  areHurryToSaveBannersShown: ComputedRef<boolean>
  /** A function for product that has multiple promotions and determine which one has the highest priority to be shown. It accepts a priority number value. */
  isHighestPriority: (priority: number) => boolean
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
  const basketPromotions = useBasketPromotions()
  const promotionData = useCurrentPromotions()

  const { appliedPromotions } = basketPromotions

  const product = toRef(productItem)

  const promotions = computed<Promotion[]>(() => {
    return promotionData.data?.value?.entities ?? []
  })

  const productPromotionId = computed(() => {
    return getFirstAttributeValue(product.value?.attributes, 'promotion')?.id
  })

  const applicablePromotions = computed<Promotion[]>(() => {
    if (!product.value || !promotions.value) {
      return []
    }
    return getApplicablePromotionsForProduct(product.value, promotions.value)
  })

  const getPromotionWithPriority = (items: Promotion[]) => {
    // Avoid "Reduce of empty array with no initial value"
    if (!items || (items.length ?? 0) === 0) {
      return
    }

    // Lower priority value equals higher priority
    return items.reduce((a, b) => (a.priority < b.priority ? a : b))
  }

  const promotion = computed(() => {
    return getPromotionWithPriority(applicablePromotions.value) || undefined
  })

  const areGiftConditionsMet = computed(() => {
    return (
      basket.data.value?.applicablePromotions?.some(
        (applicablePromotions) =>
          applicablePromotions.promotion.id === promotion.value?.id,
      ) || false
    )
  })

  const isPromotionApplied = computed(() => {
    return appliedPromotions.value.some((currentPromotion) => {
      const isSamePromotionId = currentPromotion.id === promotion.value?.id

      if (isBuyXGetYType(currentPromotion)) {
        return isSamePromotionId && currentPromotion.isValid
      }

      const isSameProduct = currentPromotion.productId === product.value?.id
      return isSamePromotionId && isSameProduct && currentPromotion.isValid
    })
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

  const isHighestPriority = (priority: number): boolean => {
    return (
      applicablePromotions.value.length > 1 &&
      promotion.value?.priority === priority
    )
  }

  const areHurryToSaveBannersShown = computed(() => {
    const hasMinOrderValue = promotion.value?.customData.minOrderValue
    return (
      !hasMinOrderValue &&
      isPromotionApplied.value &&
      (!isBuyXGetYType(promotion.value) || isGiftAddedToBasket.value)
    )
  })

  return extendPromise(
    Promise.all([basket, promotionData, basketPromotions]).then(() => ({})),
    {
      productPromotionId,
      applicablePromotions,
      promotion,
      isPromotionApplied,
      isGiftAddedToBasket,
      areGiftConditionsMet,
      areHurryToSaveBannersShown,
      isHighestPriority,
    },
  )
}
