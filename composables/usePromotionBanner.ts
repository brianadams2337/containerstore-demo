import { readonly } from 'vue'
import { useState } from '#app/composables/state'

export function usePromotionBanner() {
  const bannerHeight = useState<number>('banner-height', () => 0)

  const topBannerRef = useState<HTMLElement | null>(
    'top-banner-ref',
    () => null,
  )

  const setTopBannerRef = (element: HTMLElement | null): void => {
    topBannerRef.value = element
  }

  const setBannerHeight = (value: number): void => {
    bannerHeight.value = value
  }

  return {
    bannerHeight: readonly(bannerHeight),
    setBannerHeight,
    topBannerRef,
    setTopBannerRef,
  }
}
