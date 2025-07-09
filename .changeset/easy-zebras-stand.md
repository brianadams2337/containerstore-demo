---
'@scayle/storefront-application-nuxt': patch
---

**\[UI\]** Addressed an issue where using margins to position the `SFPopover.vue` content created a gap that would cause the hover state to flicker.
The component now uses transparent borders instead, which closes the gap and provides a stable hover experience.
