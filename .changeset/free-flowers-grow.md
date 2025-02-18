---
'@scayle/storefront-boilerplate-nuxt': patch
---

Set `lazy` option to true for loading product data on PDP. This approach enables preselection of variants during SSR and ensures that an HTTP error status code is returned if there's an issue while fetching the data.
