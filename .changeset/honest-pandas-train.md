---
'@scayle/storefront-application-nuxt': patch
---

**\[E2E\]** To simplify the process of running and understanding our end-to-end tests, all test files have been updated with detailed JSDoc documentation.
Developers can now find the purpose, scope, and all necessary prerequisites—including required environment variables for test users and specific setup notes—directly within each test file, streamlining the testing workflow:

- `e2e-CountryDetector.spec.ts`: Explanation of timezone forcing for Country Detector modal testing.
- `e2e-Footer.spec.ts`: Description of the test suite's scope.
- `e2e-Orders.spec.ts`: Details on environment variable setup for test user credentials.
- `e2e-OrderSuccessPage.spec.ts`: Prerequisites regarding product availability for successful order completion.
- `e2e-Wishlist.spec.ts`: Scope and environment variable requirements for test user credentials.
