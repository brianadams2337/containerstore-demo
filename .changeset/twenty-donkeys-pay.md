---
'@scayle/storefront-application-nuxt': patch
---

**\[Unit Testing\]** Added a global mock for `routeChangeTrackingObserver` middleware.

The `routeChangeTrackingObserver.global.ts` middleware uses a `setTimeout` which can cause issues in resource-constrained environments like GitLab CI. The timeout callback might execute after `vitest` has finished and torn down the `happy-dom` environment, leading to a `"ReferenceError: document is not defined"`.

We're introducing a global mock for the middleware during `vitest` tests. This mock replaces the original middleware logic with an empty mock function (`vi.fn()`), preventing the error during test runs and ensuring test stability, especially in CI.

- Renamed `templates/nuxt/test/vitest-setup/storefront-nuxt.ts` to `templates/nuxt/test/vitest-setup/storefront.ts` to define global mocks.
