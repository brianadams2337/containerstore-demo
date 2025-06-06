---
'@scayle/storefront-application-nuxt': patch
---

**\[Accessibility\]** Corrected an invalid ARIA implementation in `SFShopSwitcherFlyoutBody.vue` by removing a `role="menu"` attribute from a `<div>` wrapper.
This resolves an accessibility issue where the element failed to meet the requirement of containing appropriate child roles (e.g., `menuitem`).
