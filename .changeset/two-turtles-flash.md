---
'@scayle/storefront-boilerplate-nuxt': minor
---

[Authentication] Implement authentication flow interface. Key changes include:
simplified overall layout, updated text input styles and gender selection field,
enhanced accessibility (including improved semantics and keyboard navigation),
refined validation rules, API error messages displayed in an error container,
and success messages shown via a toast notification upon successful login.
From a functionality standpoint, we now consistently store the `redirectUrl`
before navigating to the `signin` route. This ensures that after a successful
login, users are seamlessly redirected to their previous page. Regarding performance
enhancements, the entire `signin` page is now rendered server-side (SSR) from the outset.
By eliminating the `last logged in user` logic, we no longer need to handle local storage
on the client side, resulting in a more efficient and streamlined process.
