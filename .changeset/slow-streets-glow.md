---
'@scayle/storefront-application-nuxt': minor
---

**\[CMS\]** Addressed an issue where the `<CMSText />` component would fail if not nested within a paragraph from Contentful.
The component now correctly checks the node type and can render standalone text content.
