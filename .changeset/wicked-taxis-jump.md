---
'@scayle/storefront-application-nuxt': patch
---

**\[Account\]** Resoved an issue where the modal in `SFAuthForgotPassword` component was closing unexpectedly when submitting the form with the enter key.

The form used the first button instead of the submit button when the enter key was pressed. This was causing the modal to close instead of validating the form.
The non-submit button is now changed to `type="button"`.
