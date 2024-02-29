export function usePromotionConditionBanner(
  minOrderValueLeft: Ref<number>,
  quantityLeft: Ref<number | undefined>,
) {
  const { $i18n } = useNuxtApp()
  const { formatCurrency } = useFormatHelpers()

  const label = computed(() => {
    const formattedMinOrderValueLeft = formatCurrency(minOrderValueLeft.value)

    const quantityLabel = $i18n.t('basket.promotion.quantity', {
      quantityLeft: quantityLeft.value,
    })
    const minOrderValueLabel = $i18n.t('basket.promotion.mov', {
      minOrderValueLeft: formattedMinOrderValueLeft,
    })
    const quantityAndMinOrderValueLabels = $i18n.t(
      'basket.promotion.quantity_and_mov',
      {
        quantityLeft: quantityLeft.value,
        minOrderValueLeft: formattedMinOrderValueLeft,
      },
    )

    if (minOrderValueLeft.value && quantityLeft.value) {
      return quantityAndMinOrderValueLabels
    }

    return minOrderValueLeft.value ? minOrderValueLabel : quantityLabel
  })

  return { label }
}
