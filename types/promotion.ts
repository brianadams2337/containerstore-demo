import {
  Promotion as CorePromotion,
  PromotionCustomData,
} from '@scayle/storefront-nuxt'

type CustomData = PromotionCustomData &
  Partial<{
    headlineChunks: string[]
    terms: string
    minOrderValue: number
    category: string
    cardColorHex: string
  }>

export {}

declare global {
  type Promotion = CorePromotion & { customData: CustomData }
}
