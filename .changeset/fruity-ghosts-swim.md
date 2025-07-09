---
'@scayle/storefront-application-nuxt': minor
---

**\[UI\]** The `SFHeadline` component has been refactored.
The `loading` prop and its associated skeleton loader are no longer part of the component;
developers are now responsible for handling the loading state externally (e.g., with a wrapper component).
The `hidden` prop and the custom `visually-hidden` class have also been removed to streamline the component's API.
