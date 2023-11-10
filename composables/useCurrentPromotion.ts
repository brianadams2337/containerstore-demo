import { PromotionEffectType } from '@scayle/storefront-nuxt'

export default (promotions: Promotion[] = []) => {
  const promotion = useState<Promotion | null>(
    'current-promotion',
    () => promotions[1] || null,
  )

  const setCurrentPromotion = (newPromotion: Promotion) => {
    promotion.value = newPromotion
  }

  const currentPromotion = computed(() => promotion.value)

  const backgroundColorStyle = computed(() => {
    return getBackgroundColorStyle(currentPromotion.value?.customData.colorHex)
  })

  const headlineParts = computed(() => {
    return currentPromotion.value?.customData?.headlineParts
  })

  const minOrderValue = computed(() => {
    return currentPromotion.value?.customData?.minOrderValue || 0
  })

  const category = computed(() => currentPromotion.value?.customData?.category)

  const expirationDate = computed(() => currentPromotion.value?.schedule.to)

  const isAutomaticDiscount = computed(() => {
    const type = currentPromotion.value?.effect.type
    return type === PromotionEffectType.AUTOMATIC_DISCOUNT
  })

  const isBuyXGetY = computed(() => {
    const type = currentPromotion.value?.effect.type
    return type === PromotionEffectType.BUY_X_GET_Y
  })

  const automaticDiscount = computed(() => {
    const type = currentPromotion.value?.effect.type
    if (type === PromotionEffectType.AUTOMATIC_DISCOUNT) {
      return currentPromotion.value?.effect.additionalData.value
    }
  })

  return {
    currentPromotion,
    setCurrentPromotion,
    backgroundColorStyle,
    headlineParts,
    minOrderValue,
    category,
    expirationDate,
    isAutomaticDiscount,
    isBuyXGetY,
    automaticDiscount,
  }
}
