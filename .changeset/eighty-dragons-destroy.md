---
'@scayle/storefront-boilerplate-nuxt': patch
---

Optimizing E2E tests to run faster and be more resilient.

- Added `{ waitUntil: 'commit' }` or `{ waitUntil: 'load' }` to `page.goto()` method where possible.
- Implemented retry mechanism using `expect()` to handle callback function with the Playwright built-in `toPass()` method to avoid possible failures caused by hydration.
- Added `test.step` into some tests with more steps to complete, to achieve better readability in the reports.
