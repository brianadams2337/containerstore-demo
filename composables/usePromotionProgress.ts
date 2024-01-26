export async function usePromotionProgress() {
  const { data: basketData } = await useBasket()

  const { currentPromotion } = useCurrentPromotion()
  const { formatCurrency } = useFormatHelpers()

  const minOrderValue = computed(() => {
    return currentPromotion.value?.customData?.minOrderValue || 0
  })

  const minOrderAmount = computed(() => divideByHundred(minOrderValue.value))

  const basketTotal = computed(() => {
    const promotionReductions = _sum(
      basketData.value.cost.appliedReductions
        .filter(({ category }) => category === 'promotion')
        .map(({ amount }) => amount.absoluteWithTax),
    )

    return basketData.value.cost.withTax + promotionReductions
  })

  const progress = computed(() => {
    if (!minOrderValue.value) {
      return 0
    }

    return basketTotal.value / minOrderAmount.value
  })

  const isFullProgress = computed(() => {
    return !!progress.value && progress.value >= 100
  })

  const formattedAmount = computed(() => formatCurrency(minOrderValue.value))

  const formattedAmountLeft = computed(() => {
    if (!minOrderValue.value) {
      return
    }
    return formatCurrency(minOrderValue.value - basketTotal.value)
  })

  return {
    minOrderAmount,
    progress,
    isFullProgress,
    formattedAmount,
    formattedAmountLeft,
  }
}
