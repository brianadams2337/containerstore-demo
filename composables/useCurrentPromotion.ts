import { computed } from 'vue'
import { useState } from '#app/composables/state'
import {
  getAdditionalData,
  getBackgroundColorStyle,
  isAutomaticDiscountType,
  isBuyXGetYType,
} from '~/utils'
import type { Promotion } from '~/types/promotion'

export function useCurrentPromotion(promotions: Promotion[] = []) {
  const promotion = useState<Promotion | null>(
    'current-promotion',
    () => promotions[0] || null,
  )

  const setCurrentPromotion = (newPromotion: Promotion) => {
    promotion.value = newPromotion
  }

  const currentPromotion = computed(() => promotion.value)

  const backgroundColorStyle = computed(() => {
    return getBackgroundColorStyle(currentPromotion.value?.customData.colorHex)
  })

  const headlineParts = computed(() => {
    return currentPromotion.value?.customData?.headlineParts
  })

  const minOrderValue = computed(() => {
    return currentPromotion.value?.customData?.minOrderValue || 0
  })

  const category = computed(() => currentPromotion.value?.customData?.category)

  const expirationDate = computed(() => currentPromotion.value?.schedule.to)

  const isAutomaticDiscount = computed(() => {
    return isAutomaticDiscountType(currentPromotion.value)
  })

  const isBuyXGetY = computed(() => isBuyXGetYType(currentPromotion.value))

  const automaticDiscount = computed(() => {
    return getAdditionalData(currentPromotion.value)?.value
  })

  return {
    currentPromotion,
    setCurrentPromotion,
    backgroundColorStyle,
    headlineParts,
    minOrderValue,
    category,
    expirationDate,
    isAutomaticDiscount,
    isBuyXGetY,
    automaticDiscount,
  }
}
