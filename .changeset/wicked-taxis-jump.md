---
'@scayle/storefront-application-nuxt': patch
---

**\[Account\]** Improved the behavior of the "Forgot Password" form.
Submitting the form by pressing the Enter key now correctly validates the input instead of unexpectedly closing the modal.
This was resolved by explicitly setting the non-submit button's type to button, ensuring the correct button is triggered on form submission.
