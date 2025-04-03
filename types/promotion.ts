import type { CentAmount } from '@scayle/storefront-nuxt'

declare module '@scayle/storefront-nuxt' {
  interface PromotionCustomData {
    product?: {
      attributeId: number
      badgeLabel: string
    }
    headline?: string
    subline?: string
    conditions?: string
    minimumOrderValue?: CentAmount
    color?: {
      background: string
      text: string
    }
    hideCountdown?: boolean
    link?: string
  }
}
