export default async () => {
  const basket = await useBasket()

  const appliedPromotions = computed(() => {
    return basket.items.value
      .filter((it) => it.promotion?.isValid)
      .map((it) => it.promotion) as Promotion[]
  })

  const buyXGetYPromotions = computed(() => {
    return appliedPromotions.value.filter((it) => isBuyXGetYType(it))
  })

  const automaticDiscountPromotions = computed(() => {
    return appliedPromotions.value.filter((it) => isAutomaticDiscountType(it))
  })

  return {
    appliedPromotions,
    buyXGetYPromotions,
    automaticDiscountPromotions,
  }
}
