---
'@scayle/storefront-boilerplate-nuxt': patch
---

Utility Replacement: Replaced `radash.group` with native array operations:

```ts
arrayValue.reduce(
  (acc, item) => {
    const groupId = item.id // Exchange item.id with the appropriate object key
    if (!acc[groupId]) acc[groupId] = []
    acc[groupId].push(item)
    return acc
  },
  {} as Record<string, TypeOfArrayElement[]>,
)
```
