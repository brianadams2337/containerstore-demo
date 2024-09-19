---
'@scayle/storefront-boilerplate-nuxt': patch
---

Utility Replacement: Replaced `radash.dash` with native string operations

```ts
stringValue
  .split(/[\s_.-]+|(?=[A-Z][a-z])/)
  .join('-')
  .toLowerCase()
```
