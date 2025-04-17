---
'@scayle/storefront-application-nuxt': minor
---

**\[Architecture\]** Replaced `SFProductCardImageSliderButton` and `SFButton` usages with the new shared `SFSliderArrowButton` component for consistent arrow button design across the Storefront application.

`SFSliderArrowButton` includes accessibility features previously implemented in `SFProductCardImageSliderButton`, ensuring continued a11y support while extending it to areas that previously used `SFButton` without such enhancements.
