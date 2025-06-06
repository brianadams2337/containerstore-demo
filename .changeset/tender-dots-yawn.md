---
'@scayle/storefront-application-nuxt': minor
---

**\[UI\]** Addressed a Safari-specific rendering bug where an unwanted shadow would appear on the main content area after closing the filter slide-in.
This was resolved by adding a `focus:shadow-none` utility class to the `default` layout's `main` tag.
