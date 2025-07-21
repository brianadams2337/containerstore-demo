---
'@scayle/storefront-application-nuxt': patch
---

**\[E2E\]** Enhanced end-to-end test framework by improving its modularity and reusability.
Introduced a foundational Base class (`playwright/page-objects/base/base.ts)` to serve as an abstract Page Object for both full application pages and individual UI components. This centralizes common properties and logic, promoting consistency and maintainability across all Page Objects.
Implemented a suite of helper functions within `playwright/support/utils.ts`. These utilities abstract repetitive test automation tasks, such as navigating to Product Listing Pages (PLPs) or applying filters, enhancing test readability and reusability.
