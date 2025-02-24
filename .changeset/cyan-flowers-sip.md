---
'@scayle/storefront-boilerplate-nuxt': minor
---

**\[CMS\]** Remove the `CMSAppFooterData` component from each CMS provider as it is no longer in use.
This component was responsible for fetching and rendering the application footer content,
which primarily consisted of links. This functionality is now obsolete since the footer
content and links are fetched directly from footer navigation composables provided by `storefront-nuxt`.
These links are configured via [SCAYLE Navigation](https://scayle.dev/en/user-guide/shops/storefront/navigation) in the the Panel.
