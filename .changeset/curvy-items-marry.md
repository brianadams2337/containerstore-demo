---
'@scayle/storefront-application-nuxt': minor
---

**\[E2E\]** Enhanced the stability and maintainability of end-to-end tests through the refactoring focused on the main points:

Product Independence: Updated tests (Basket, Checkout, Order Success Page) to interact with the first available product variant, decoupling them from specific product IDs and ensuring robustness across different product streams.

Category Independence: Modified navigation tests (Main Navigation, PLP, Happy Path) to navigate through menu items and categories dynamically, removing reliance on a fixed category structure.

Test Cleanup: Removed outdated tests (Footer - Shopping promises, Wishlist - Add to Basket) and associated test data to streamline the test suite.
