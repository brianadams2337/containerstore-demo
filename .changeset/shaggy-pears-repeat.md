---
'@scayle/storefront-boilerplate-nuxt': minor
---

[Accessibility] Centralize keyboard behavior logic within the `SFSlideIn` component of `storefront-ui` module.
This approach eliminates redundant logic in each slide-in instance and ensures consistent coverage
of accessibility features (e.g., `SFFilterSlideIn.vue`).
The update includes activating a focus trap, defining the correct focus/tab order,
and adding the `Esc` key functionality to close the slide-in.
