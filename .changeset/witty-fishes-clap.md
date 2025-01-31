---
'@scayle/storefront-boilerplate-nuxt': patch
---

[E2E] Improved the robustness of the end-to-end test for filter deeplinks. The test now validates filter functionality irrespective of the order in which filters are returned by the backend. This addresses an issue where variations in filter order could lead to false negative test results, ensuring more consistent and reliable testing.
