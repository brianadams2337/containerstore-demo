---
'@scayle/storefront-boilerplate-nuxt': minor
---

[Performance] Resolved a hydration mismatch issue in the `SFQuantityInput` component specifically affecting Firefox. The disabled attribute was sometimes missing from the JavaScript DOM Node object, triggering hydration warnings. To prevent these warnings without impacting functionality, the `data-allow-mismatch="attribute"` attribute has been added. This tells the hydration process to tolerate mismatches on this specific attribute.
