import { PromotionEffectType, type BasketItem } from '@scayle/storefront-nuxt'

export default (basketItem: Ref<BasketItem>) => {
  const promotion = computed<BasketPromotion | undefined>(() => {
    return basketItem.value?.promotion
  })

  const isBuyXGetY = computed(() => {
    return promotion.value?.effect.type === PromotionEffectType.BUY_X_GET_Y
  })

  const isAutomaticDiscount = computed(() => {
    return (
      promotion.value?.effect.type === PromotionEffectType.AUTOMATIC_DISCOUNT
    )
  })

  const backgroundColorStyle = computed(() => {
    return getBackgroundColorStyle(promotion.value?.customData?.colorHex)
  })

  const isFreeGift = computed(() => {
    return isBuyXGetY.value && basketItem.value.price.total.withTax === 0
  })

  const hasFailedConditions = computed(() => {
    return !!basketItem.value?.promotion?.failedConditions?.length
  })

  return {
    isBuyXGetY,
    isAutomaticDiscount,
    backgroundColorStyle,
    isFreeGift,
    promotion,
    hasFailedConditions,
  }
}
