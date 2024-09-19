import type {
  BasketItem,
  Promotion as CorePromotion,
  PromotionCustomData,
} from '@scayle/storefront-nuxt'

// This data can potentially change per tenant needs so the main goal is to
// change the types here so that it reflects the `customData` response payload
type CustomData = PromotionCustomData &
  Partial<{
    product: {
      promotionId: number
      badgeLabel: string
    }
    // This should match the `itemConditions`/`globalConditions` when creating or updating the  promotion
    giftConditions: Partial<{
      productId: number
      minQuantity: number
    }>
    category: {
      id: number
      ctaLabel: string
    }
    headlineParts: string[]
    terms: string
    minOrderValue: number
    colorHex: string
  }>

export {}

declare global {
  export type Promotion = CorePromotion & { customData: CustomData }
  export type BasketPromotion = BasketItem['promotion'] & Promotion
}
