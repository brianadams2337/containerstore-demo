import {
  type Product,
  getFirstAttributeValue,
  extendPromise,
} from '@scayle/storefront-nuxt'
import { type MaybeRefOrGetter, toRef, computed, type ComputedRef } from 'vue'
import { useBasketPromotions } from '~/composables/useBasketPromotions'
import { useBasket, useCurrentPromotions } from '#storefront/composables'
import type { Promotion } from '~/types/promotion'
import {
  getApplicablePromotionsForProduct,
  getVariantIds,
  isBuyXGetYType,
} from '~/utils'

type UseProductPromotionsReturn = {
  promotionLabel: ComputedRef<string | undefined>
  productPromotionId: ComputedRef<number | undefined>
  applicablePromotions: ComputedRef<Promotion[]>
  promotion: ComputedRef<Promotion | undefined>
  isPromotionApplied: ComputedRef<boolean>
  isGiftAddedToBasket: ComputedRef<boolean>
  areGiftConditionsMet: ComputedRef<boolean>
  areHurryToSaveBannersShown: ComputedRef<boolean>
  isHighestPriority: (id: number) => boolean
}

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

  const promotionLabel = computed(() => {
    return getFirstAttributeValue(product.value?.attributes, 'promotion')?.label
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
      promotionLabel,
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
