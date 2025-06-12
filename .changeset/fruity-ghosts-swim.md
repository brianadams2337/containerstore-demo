---
'@scayle/storefront-application-nuxt': minor
---

**\[UI\]** Refactored the `SFHeadline` component by eliminating the `loading`
feature and its skeleton loader, delegating this responsibility to external handling.
Additionally, removed the `hidden` property and the `visually-hidden` custom Tailwind class,
as their usage was redundant within this context.
