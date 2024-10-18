---
'@scayle/storefront-boilerplate-nuxt': patch
---

Check country detection modal is open on page load

- Added additional condition in `closeModal()` to check if the Country detection modal is open on page load. This improves tests stability in case when the test suite is executed from a different time zone than the current shop.
