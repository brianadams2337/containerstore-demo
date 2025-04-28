---
'@scayle/storefront-application-nuxt': patch
---

**\[Accessibility\]** Removed `role="menu"` from the `<div>` wrapper in `SFShopSwitcherFlyoutBody.vue` selector to fix broken ARIA behavior.
The ARIA role `menu` did not contain at least one element with `role="menuitem"`, `role="menuitemcheckbox"`, or `role="menuitemradio"`.
