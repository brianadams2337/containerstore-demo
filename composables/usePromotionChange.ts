export default (promotions: Promotion[]) => {
  const currentPromotion = useState<Promotion>(
    'current-promotion',
    () => promotions[1],
  )

  const timeoutId = ref<NodeJS.Timeout>()

  const showNextPromotion = (currentIndex = 0) => {
    timeoutId.value = setTimeout(() => {
      const isLast = currentIndex === promotions.length - 1
      const idx = isLast ? 0 : currentIndex + 1
      currentPromotion.value = promotions[currentIndex]
      showNextPromotion(idx)
    }, PROMOTIONS_CHANGE_DELAY)
  }

  onMounted(() => showNextPromotion())
  onUnmounted(() => clearTimeout(timeoutId.value))

  return {
    currentPromotion,
    showNextPromotion,
  }
}
