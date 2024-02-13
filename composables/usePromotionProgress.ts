export async function usePromotionProgress() {
  const { data: basketData } = await useBasket()

  const { currentPromotion } = useCurrentPromotion()
  const { formatCurrency } = useFormatHelpers()

  const minOrderValue = computed<number>(() => {
    return currentPromotion.value?.customData?.minOrderValue || 0
  })

  const minOrderAmount = computed<number>(() => {
    return divideByHundred(minOrderValue.value)
  })

  const basketTotal = computed<number>(() => {
    const promotionReductions = _sum(
      basketData.value.cost.appliedReductions
        .filter(({ category }) => category === 'promotion')
        .map(({ amount }) => amount.absoluteWithTax),
    )

    return basketData.value.cost.withTax + promotionReductions
  })

  const progress = computed<number>(() => {
    if (!minOrderValue.value) {
      return 0
    }

    return basketTotal.value / minOrderAmount.value
  })

  const isFullProgress = computed<boolean>(() => {
    return !!progress.value && progress.value >= 100
  })

  const formattedAmountLeft = computed<string | undefined>(() => {
    if (!minOrderValue.value) {
      return
    }
    return formatCurrency(minOrderValue.value - basketTotal.value)
  })

  const formattedDiscount = computed<string | undefined>(() => {
    const promotedItem = basketData.value.items.find(
      (item) => item.promotionId === currentPromotion.value?.id,
    )

    const reduction = promotedItem?.price.total.appliedReductions.find(
      ({ category }) => category === 'promotion',
    )

    if (!reduction) {
      return
    }

    return formatCurrency(reduction?.amount.absoluteWithTax)
  })

  const isMOVPromotionApplied = computed<boolean>(() => {
    if (!minOrderValue.value) {
      return false
    }
    return basketData.value.items.some(({ promotionId }) => {
      return promotionId === currentPromotion.value?.id
    })
  })

  return {
    minOrderAmount,
    progress,
    isFullProgress,
    formattedAmountLeft,
    formattedDiscount,
    isMOVPromotionApplied,
  }
}
