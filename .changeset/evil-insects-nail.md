---
'@scayle/storefront-application-nuxt': minor
---

Consolidated `useFormatDate` and `useFormatDistance` into a single `useFormat` composable.

Before:

```typescript
const { formateLocaleDate } = useFormatDate()
const formatDistance = useFormatDistance()

formatDate(new Date())
formatDistance(100)
```

After:

```typescript
const { formatDate, formatDistance } = useFormat()

formatDate(new Date())
formatDistance(100)
```

Additionally, the `formatLocaleDate` has been renamed to simply `formatDate` and it now returns `undefined` rather than `null` when no locale is availble. This conforms to the standard pattern for missing values within SCAYLE Storefront.
