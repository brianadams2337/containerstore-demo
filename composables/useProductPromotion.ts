import {
  type Product,
  PromotionEffectType,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'

export default async (productItem: MaybeRefOrGetter<Product>) => {
  const promotionData = await useCurrentPromotions()

  const product = toRef(productItem)

  const promotionLabel = computed(() => {
    return getFirstAttributeValue(product.value.attributes, 'promotion')?.label
  })

  const productPromotionId = computed(() => {
    return getFirstAttributeValue(product.value.attributes, 'promotion')?.id
  })

  const applicablePromotion = computed<Promotion>(() => {
    const promotions = promotionData.data.value.entities
    return promotions.find((it) => {
      return it.customData.productPromotionId === productPromotionId.value
    })
  })

  const backgroundColorStyle = computed(() => {
    const color = applicablePromotion.value.customData.colorHex
    return getBackgroundColorStyle(color)
  })

  const isAutomaticDiscount = computed(() => {
    const type = applicablePromotion.value?.effect.type
    return type === PromotionEffectType.AUTOMATIC_DISCOUNT
  })

  const isBuyXGetY = computed(() => {
    const type = applicablePromotion.value?.effect.type
    return type === PromotionEffectType.BUY_X_GET_Y
  })

  return {
    promotionLabel,
    productPromotionId,
    applicablePromotion,
    backgroundColorStyle,
    isAutomaticDiscount,
    isBuyXGetY,
  }
}
