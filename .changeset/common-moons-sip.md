---
'@scayle/storefront-application-nuxt': patch
---

**\[E2E\]** The end-to-end tests for user authentication have been refactored to improve maintainability and clarity.
The constant objects related to logged-in user and registration tests have been updated, and comprehensive JSDoc documentation has been added to explain the required environment variable setup for dedicated test users.
Inline comments now outline the prerequisites, including the creation of specific test users via environment variables.

- `TEST_USER_EMAIL1=`: Dedicated test user for Chromium and default test user across end-to-end tests.
- `TEST_USER_EMAIL2`: Dedicated test user for desktop Firefox.
- `TEST_USER_EMAIL3`: Dedicated test user for desktop Webkit (Safari).
- `TEST_USER_EMAIL4`: Dedicated test user for mobile Chrome.
- `TEST_USER_EMAIL5`: Dedicated test user for mobile Webkit (Safari).
- `TEST_USER_NO_ORDERS`: Test user with no orders placed. Used to verify Orders page empty state.
- `TEST_USER_PASSWORD=`: Password (the same for all test users listed above).
- `TEST_USER_WRONG_PASSWORD`: Password used for test that verifies user authentication with wrong credentials.
- `TEST_USER_GUEST`: Test user used to verify Registration process for guest user.
