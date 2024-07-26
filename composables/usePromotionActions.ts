import { readonly } from 'vue'
import { useState } from '#app/composables/state'

export function usePromotionActions() {
  const isPromotionListShown = useState('promotion-list-shown', () => false)

  const isPromotionBannerShown = useState('promotion-banner-shown', () => true)

  const topBannerRef = useState<HTMLElement | null>(
    'top-banner-ref',
    () => null,
  )

  const bottomBannerRef = useState<HTMLElement | null>(
    'bottom-banner-ref',
    () => null,
  )

  const togglePromotionList = (): void => {
    isPromotionListShown.value = !isPromotionListShown.value
  }

  const togglePromotionBanner = (): void => {
    isPromotionBannerShown.value = !isPromotionBannerShown.value
  }

  const setBannerRef = (
    element: HTMLElement | null,
    position: 'top' | 'bottom',
  ): void => {
    if (position === 'top') {
      topBannerRef.value = element
    }
    if (position === 'bottom') {
      bottomBannerRef.value = element
    }
  }

  return {
    togglePromotionList,
    togglePromotionBanner,
    isPromotionListShown: readonly(isPromotionListShown),
    isPromotionBannerShown: readonly(isPromotionBannerShown),
    topBannerRef,
    bottomBannerRef,
    setBannerRef,
  }
}
