export function usePromotionChange(promotions: Promotion[]) {
  const { setCurrentPromotion } = useCurrentPromotion(promotions)

  const timeoutId = ref<NodeJS.Timeout>()

  const showNextPromotion = (currentIndex = 0) => {
    timeoutId.value = setTimeout(() => {
      const isLast = currentIndex === promotions.length - 1
      const idx = isLast ? 0 : currentIndex + 1
      setCurrentPromotion(promotions[currentIndex])
      showNextPromotion(idx)
    }, PROMOTIONS_CHANGE_DELAY)
  }

  onMounted(() => showNextPromotion())
  onUnmounted(() => clearTimeout(timeoutId.value))
}
