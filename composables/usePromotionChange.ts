const SHOW_PROMOTIONS_DELAY = 5000

export default (promotions: Promotion[]) => {
  const currentPromotion = useState<Promotion>(
    'current-promotion',
    () => promotions[0],
  )

  const timeoutId = ref<NodeJS.Timeout>()

  const showNextPromotion = (currentIdx = -1) => {
    timeoutId.value = setTimeout(() => {
      const isLast = currentIdx === promotions.length - 1
      const idx = isLast ? 0 : currentIdx + 1
      currentPromotion.value = promotions[idx]
      showNextPromotion(idx)
    }, SHOW_PROMOTIONS_DELAY)
  }

  onMounted(() => showNextPromotion())
  onUnmounted(() => clearTimeout(timeoutId.value))

  return {
    currentPromotion,
  }
}
