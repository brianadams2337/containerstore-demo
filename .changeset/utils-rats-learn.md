---
'@scayle/storefront-boilerplate-nuxt': patch
---

Utility Replacement: Utility Replacement: Replaced `radash.min` with native array operations:

```ts
// Plain array
// Input: [4, 2, 8, 6]
// Output: [2]
Math.min(...(numbersArray.length ? numbersArray : []))

// Array containing objects
// Input: [{ numberValue: 4 }, { numberValue: 2 }, { numberValue: 8 }, { numberValue: 6 }]
// Output: { numberValue: 2 }
const getValueForComparison = (objectValue) => objectValue.numberValue
array.reduce((a, b) =>
  getValueForComparison(a) < getValueForComparison(b) ? a : b,
)
```
