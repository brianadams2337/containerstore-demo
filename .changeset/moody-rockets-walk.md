---
'@scayle/storefront-boilerplate-nuxt': minor
---

Fixed an issue where an empty IDP component was shown when no IDPs are enabled.
The `useIDP` composable now returns an empty object when the IDP integration is not enabled.

Ensure that the user is redirected to CO when entering the sign-in page with a `redirectUrl` parameter.
This is now possible with the `@scayle/storefront-nuxt@{version}`.

We refactored the IDP callback to have its own page to ensure we only call the IDP login RPC once.
