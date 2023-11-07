export default async (promotion: MaybeRefOrGetter<Promotion>) => {
  const { data: basketData } = await useBasket()

  const currentPromotion = isRef(promotion) ? promotion : toRef(promotion)

  const minOrderValue = computed(() => {
    return currentPromotion.value.customData?.minOrderValue || 0
  })
  const minOrderAmount = computed(() => divideWithHundred(minOrderValue.value))

  const progress = computed(() => {
    if (!minOrderValue.value) {
      return 0
    }
    return basketData.value.cost.withTax / minOrderAmount.value
  })

  const isFullProgress = computed(() => {
    return !!progress.value && progress.value >= 100
  })

  const formattedAmount = computed(() => toCurrency(minOrderValue.value))

  const formattedAmountLeft = computed(() => {
    return toCurrency(minOrderValue.value - basketData.value.cost.withTax)
  })

  return {
    minOrderAmount,
    progress,
    isFullProgress,
    formattedAmount,
    formattedAmountLeft,
  }
}
