import {
  type BasketItem,
  getFirstAttributeValue,
  extendPromise,
} from '@scayle/storefront-nuxt'
import { type Ref, computed } from 'vue'
import { useBasketPromotions } from './useBasketPromotions'
import { useBasket } from '#storefront/composables'
import {
  getBackgroundColorStyle,
  getBasketTotalWithoutPromotions,
  getVariantIds,
  isAutomaticDiscountType,
  isBuyXGetYType,
} from '~/utils'
import type { Promotion, BasketPromotion } from '~/types/promotion'

export function useBasketItemPromotion(basketItem: Ref<BasketItem>) {
  const basket = useBasket()
  const basketPromotions = useBasketPromotions()

  const { allCurrentPromotions } = basketPromotions

  const promotion = computed<BasketPromotion | undefined>(() => {
    return basketItem.value?.promotion
  })

  const headlineParts = computed(() => {
    return promotion.value?.customData.headlineParts
  })

  const giftPromotion = computed<Promotion | undefined>(() => {
    const id = getFirstAttributeValue(
      basketItem.value.product?.attributes,
      'promotion',
    )?.id

    if (isBuyXGetY.value) {
      return promotion.value
    }

    return allCurrentPromotions.value.find((promotion) => {
      const isFreeGift = isBuyXGetYType(promotion)
      return isFreeGift && promotion?.customData?.product?.promotionId === id
    })
  })

  const giftConditions = computed(() => {
    return giftPromotion.value?.customData?.giftConditions
  })

  const minimumOrderValueForGift = computed(() => {
    return giftPromotion.value?.customData?.minOrderValue
  })

  const minOrderValueLeft = computed(() => {
    if (!minimumOrderValueForGift.value) {
      return 0
    }
    const basketTotal = getBasketTotalWithoutPromotions(
      basket.data.value ?? undefined,
    )
    const valueLeft = minimumOrderValueForGift.value - basketTotal
    return valueLeft >= 0 ? valueLeft : 0
  })

  const areGiftConditionsMet = computed(() => {
    return (
      basket.data.value?.applicablePromotions?.some(
        (applicablePromotions) =>
          applicablePromotions.promotion.id === giftPromotion.value?.id,
      ) || false
    )
  })

  const isBuyXGetY = computed(() => isBuyXGetYType(promotion.value))

  const isAutomaticDiscount = computed(() => {
    return isAutomaticDiscountType(promotion.value)
  })

  const backgroundColorStyle = computed(() => {
    const color = promotion.value?.customData?.colorHex
    return getBackgroundColorStyle(color)
  })

  const giftBackgroundColorStyle = computed(() => {
    return getBackgroundColorStyle(giftPromotion.value?.customData?.colorHex)
  })

  const hasFailedConditions = computed(() => {
    return !!promotion.value?.failedConditions?.length
  })

  const isFreeGift = computed(() => {
    const variantIds = getVariantIds(promotion.value)
    return (
      variantIds.includes(basketItem.value.variant.id) &&
      promotion.value?.isValid
    )
  })

  const isGiftAddedToBasket = computed(() => {
    const variantIds = getVariantIds(giftPromotion.value)
    return !!basket.items.value?.some(({ promotion, variant }) => {
      const hasVariantId = variantIds.includes(variant.id)
      return hasVariantId && giftPromotion.value?.id === promotion?.id
    })
  })

  return extendPromise(
    Promise.all([basket, basketPromotions]).then(() => ({})),
    {
      isBuyXGetY,
      isAutomaticDiscount,
      backgroundColorStyle,
      isFreeGift,
      promotion,
      hasFailedConditions,
      giftPromotion,
      headlineParts,
      giftConditions,
      giftBackgroundColorStyle,
      areGiftConditionsMet,
      minOrderValueLeft,
      isGiftAddedToBasket,
    },
  )
}
