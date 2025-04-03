---
'@scayle/storefront-boilerplate-nuxt': minor
---

Introduce `@scayle/storefront-promotions` module and `useApplyPromotions` composable. `useApplyPromotions` can be used to add applicable promotions to basket items whenever the basket is modified.

```typescript
import { useApplyPromotions } from '#storefront-promotions/composables/useApplyPromotions'

const { data: basket, addItem  } = await useBasket()
const { applyPromotions } = useApplyPromotions()

await applyPromotions(basket)

await addItem({...})
await applyPromotions(basket)

```
