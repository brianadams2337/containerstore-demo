---
'@scayle/storefront-application-nuxt': minor
---

**\[PLP\]** To enhance mobile usability, the new `SFMobileSortSelection.vue` component has been introduced.
It implements a slider-and-chip interface and replaces the former dropdown-based sorting logic within SFFilterSlideInContent.vue.
The previous dropdown implementation for sort selection on mobile devices was not optimal for touch interactions and required multiple taps to change sort options.
The new slider interface with chips provides better touch targets for mobile users, offers immediate visual feedback and reduces the number of interactions needed to change sort order.
