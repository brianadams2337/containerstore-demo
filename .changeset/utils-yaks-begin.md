---
'@scayle/storefront-boilerplate-nuxt': patch
---

Utility Replacement: Replaced `radash.capitalize` with native string operations:

```ts
stringValue.charAt(0).toUpperCase() + stringValue.slice(1)
```
