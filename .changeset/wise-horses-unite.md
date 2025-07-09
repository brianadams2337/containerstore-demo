---
'@scayle/storefront-application-nuxt': patch
---

**\[Login & Registration\]** Refactored the error handling strategy in the useAuthentication composable.
Authentication methods (`login`, `guestLogin`, `logout`, `register`, `forgotPassword`, `resetPasswordByHash`) now throw exceptions instead of internally caching them.
This creates a more predictable and standard error handling pattern, requiring consuming components to handle failures explicitly.
