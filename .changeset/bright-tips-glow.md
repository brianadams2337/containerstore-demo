---
'@scayle/storefront-application-nuxt': patch
---

**\[Account\]** Improved the user experience in the "Forgot Password" modal by ensuring that old error messages are cleared when the modal is closed. Users will no longer see a stale error message when reopening the form.

The `errorMessage` is now correctly reset to `null` when the modal is dismissed.
