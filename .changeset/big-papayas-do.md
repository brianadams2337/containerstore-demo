---
'@scayle/storefront-application-nuxt': minor
---

Disables automatic closing of `/components/filter/SFFilterSlideIn.vue` on route changes. Since filters are stored in the URL and alter the route when applied, we want to prevent the filter slide-in from automatically closing when the route changes.
