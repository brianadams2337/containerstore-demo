---
'@scayle/storefront-boilerplate-nuxt': minor
---

[Hydration] Replace the `useId` with the `placeholder` and optional `name` in
`SFTextInput` until Nuxt `3.15` upgrade ([Reference](https://github.com/nuxt/nuxt/pull/30343)).
This will ensure that input ID is unique which currently `useId` does not generate ID
consistently between the server and client
