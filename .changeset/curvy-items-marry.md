---
'@scayle/storefront-application-nuxt': minor
---

**\[E2E\]** Improved the end-to-end test suite for greater reliability and easier maintenance. Key changes include:

- Product Independence: Core tests (Basket, Checkout, OSP) now select the first available product variant instead of relying on hardcoded IDs.
- Category Independence: Navigation tests now dynamically traverse menus and categories, removing dependency on a fixed site structure.
- Test Suite Cleanup: Removed obsolete tests and their associated data to streamline the test suite.
