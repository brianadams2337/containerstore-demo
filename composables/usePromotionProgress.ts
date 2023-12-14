export default async () => {
  const { data: basketData } = await useBasket()

  const { currentPromotion } = useCurrentPromotion()

  const minOrderValue = computed(() => {
    return currentPromotion.value?.customData?.minOrderValue || 0
  })

  const minOrderAmount = computed(() => divideWithHundred(minOrderValue.value))

  const basketTotalForPromotion = computed(() => {
    const isBasketItemPromoted = basketData.value.items.some((it) => {
      return it.promotionId === currentPromotion.value?.id
    })

    if (!isBasketItemPromoted) {
      return 0
    }

    return useSum(
      basketData.value.items.map((item) => {
        const withTax = item.price.total.withTax
        const promotionReduction = item.price.total.appliedReductions.find(
          ({ category }) => category === 'promotion',
        )
        if (!promotionReduction) {
          return withTax
        }
        return withTax + promotionReduction?.amount.absoluteWithTax
      }),
    )
  })

  const progress = computed(() => {
    if (!minOrderValue.value) {
      return 0
    }

    return basketTotalForPromotion.value / minOrderAmount.value
  })

  const isFullProgress = computed(() => {
    return !!progress.value && progress.value >= 100
  })

  const formattedAmount = computed(() => toCurrency(minOrderValue.value))

  const formattedAmountLeft = computed(() => {
    return toCurrency(minOrderValue.value - basketTotalForPromotion.value)
  })

  return {
    minOrderAmount,
    progress,
    isFullProgress,
    formattedAmount,
    formattedAmountLeft,
  }
}
