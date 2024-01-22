export function usePromotionActions() {
  const isShown = useState('promotion-list-shown', () => false)

  const topBannerRef = useState<HTMLElement | null>(
    'top-banner-ref',
    () => null,
  )

  const togglePromotionList = () => {
    isShown.value = !isShown.value
  }

  const setBannerRef = (element: HTMLElement | null) => {
    topBannerRef.value = element
  }

  return {
    togglePromotionList,
    isPromotionListShown: readonly(isShown),
    topBannerRef,
    setBannerRef,
  }
}
