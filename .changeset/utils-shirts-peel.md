---
'@scayle/storefront-boilerplate-nuxt': patch
---

Utility Replacement: Replaced `radash.pick` with native array operations:

```ts
// objectValue: Record<string, unknown>
// keysList: string[]
Object.fromEntries(
  keysList
    .filter((key) => key in objectValue)
    .map((key) => [key, objectValue[key]]),
)
```
