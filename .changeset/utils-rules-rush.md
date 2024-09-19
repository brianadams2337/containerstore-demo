---
'@scayle/storefront-boilerplate-nuxt': patch
---

Utility Replacement: Replaced `radash.snake` with custom native string operations:

```ts
stringValue
  .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
  ?.map((x) => x.toLowerCase())
  .join('_')
```
