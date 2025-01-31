---
'@scayle/storefront-boilerplate-nuxt': minor
---

[UI] Removed the `stop` and `prevent` event modifiers from the `SFButton` component. These modifiers were complicating the reasoning about the expected behavior of buttons in various contexts, potentially leading to unintended side effects. This change simplifies the component's logic and makes it easier to predict how buttons will interact with other elements on the page.
