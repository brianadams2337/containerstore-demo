---
'@scayle/storefront-application-nuxt': minor
---

**\[Utilities\]** To simplify usage and improve consistency, the `useFormatDate` and `useFormatDistance` composables have been consolidated into a single, unified `useFormat` composable.
As part of this change, `formatLocaleDate has been renamed to the simpler`formatDate, and it now returns undefined (instead of `null`) when no locale is available, aligning with our standard patterns.

```typescript
// BEFORE
const { formateLocaleDate } = useFormatDate()
const formatDistance = useFormatDistance()

formatDate(new Date())
formatDistance(100)

// AFTER
const { formatDate, formatDistance } = useFormat()

formatDate(new Date())
formatDistance(100)
```
