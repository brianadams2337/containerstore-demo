import {
  Promotion as CorePromotion,
  PromotionCustomData,
} from '@scayle/storefront-nuxt'

// This data can potentially change per tenant needs so the main goal is to
// change the types here so that it reflects the `customData` response payload
type CustomData = PromotionCustomData &
  Partial<{
    productPromotionId: number
    headlineParts: string[]
    terms: string
    minOrderValue: number
    category: string
    colorHex: string
  }>

export {}

declare global {
  type Promotion = CorePromotion & { customData: CustomData }

  type AutomaticDiscountAdditionalData = {
    type: 'absolute' | 'relative'
    value: number
  }

  type BuyXGetYAdditonalData = {
    maxCount: number
    variantIds: number[]
  }
}
