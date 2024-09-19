---
'@scayle/storefront-boilerplate-nuxt': patch
---

Utility Replacement: Replaced `radash.pascal` with native string operations:

```ts
stringValue
  .split(/[\s_.-]+|(?=[A-Z][a-z])/)
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join('')
```
