---
'@scayle/storefront-boilerplate-nuxt': minor
---

**\[Promotions\]** Custom Data for promotions now has a new structure:

```ts
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
```

With this change the new promotion custom data structure is used within `/components/basket/summary/promotions/SFBasketSummaryPromotions.vue`.
