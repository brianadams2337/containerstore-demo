---
'@scayle/storefront-application-nuxt': patch
---

**\[Accessibility\]** To ensure proper keyboard interaction, the search input trigger has been assigned `role="button"`.
This correctly identifies it as an interactive element for assistive technologies and resolves the "Non-active element in tab order" issue.
