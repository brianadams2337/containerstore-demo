---
'@scayle/storefront-application-nuxt': patch
---

**\[E2E\]** Improved Search Test versatility via Environment Variable Configuration: The end-to-end search test suite has been refactored to consume test data from environment variables. This design enables streamlined execution in diverse environments by requiring only the definition of specific search term values as environment variables.

As a prerequisite to successfully run the Search end-to-end tests, the following environment variables should be set:

- `E2E_SEARCH_TERM_PRODUCT`: Search term that doesn't match any category name, so the search suggestions are not shown, e.g. some product brand.
- `E2E_SEARCH_TERM_CATEGORY_SUGGESTION`: Search term that fully or partially matches category name, e.g. "shirt" or "shirts".
- `E2E_SEARCH_EXACT_PRODUCT_ID`: Search term that matches exact product ID, e.g. 123456.
- `E2E_SEARCH_TAGS`: Descriptive search term that returns search suggestion tags in search suggestions list, e.g. "Black shoes size 44".
- `E2E_SEARCH_PAGE`: Search term that fully or partially matches a (content) page, e.g. "faq" or "support".
- `E2E_SEARCH_REFERENCE_KEY`: Search term that matches the exact product reference key, e.g. "123-ref-key".
