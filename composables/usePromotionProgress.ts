export async function usePromotionProgress() {
  const { currentPromotion } = useCurrentPromotion()
  const { formatCurrency } = useFormatHelpers()

  const { data: basketData } = await useBasket()

  const minOrderValue = computed<number>(() => {
    return currentPromotion.value?.customData?.minOrderValue || 0
  })

  const minOrderAmount = computed<number>(() => {
    return divideByHundred(minOrderValue.value)
  })

  const basketTotal = computed<number>(() => {
    return getBasketTotalWithoutPromotions(basketData.value ?? undefined)
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
    const promotedItems = (basketData.value?.items ?? []).filter(
      (item) => item.promotionId === currentPromotion.value?.id,
    )

    const reductions = promotedItems?.reduce<number[]>((previous, current) => {
      const reduction = current.price.total.appliedReductions.find(
        ({ category }) => category === 'promotion',
      )
      if (reduction) {
        previous.push(reduction.amount.absoluteWithTax)
      }
      return previous
    }, [])

    if (!reductions) {
      return
    }

    return formatCurrency(_sum(reductions))
  })

  const isMOVPromotionApplied = computed<boolean>(() => {
    if (!minOrderValue.value) {
      return false
    }
    return (basketData.value?.items ?? []).some(({ promotionId }) => {
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
