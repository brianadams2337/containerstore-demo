import { readonly } from 'vue'
import { useState } from '#app/composables/state'

export function usePromotionActions() {
  const isPromotionListShown = useState('promotion-list-shown', () => false)

  const isPromotionBannerShown = useState('promotion-banner-shown', () => true)

  const togglePromotionList = (): void => {
    isPromotionListShown.value = !isPromotionListShown.value
  }

  const togglePromotionBanner = (): void => {
    isPromotionBannerShown.value = !isPromotionBannerShown.value
  }

  return {
    isPromotionListShown: readonly(isPromotionListShown),
    isPromotionBannerShown: readonly(isPromotionBannerShown),
    togglePromotionList,
    togglePromotionBanner,
  }
}
