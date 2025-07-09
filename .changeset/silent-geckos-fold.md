---
'@scayle/storefront-application-nuxt': patch
---

**\[Performance\]** Fixed a bug where navigating between product detail pages caused multiple executions of `redirectProductIfNecessary`, potentially creating a redirect loop.
The function now checks if the product status is `pending` before executing, ensuring it only runs once per navigation.
