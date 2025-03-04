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
    category: {
      id: number
      ctaLabel: string
    }
    headlineParts: string[]
    terms: string
    minOrderValue: number
    colorHex: string
  }>

export type Promotion = CorePromotion & { customData: CustomData }
export type BasketPromotion = BasketItem['promotion'] & Promotion
