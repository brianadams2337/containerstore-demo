---
'@scayle/storefront-application-nuxt': patch
---

**\[Architecture\]** Refactored `useAuthentication` to longer be tied to a specific authentication action. This simplifies the usage of the composable and prevents possible unexpected behavior if there is a mismatch between the authentication string passed to the composable and the authentication method which is called.

- **Before**

  ```ts
  const { login, logout } = useAuthentication('login')

  login({ username, password }) // 'login' success or error message and 'login' event tracked
  logout() // 'login' success or error message and 'login' event tracked
  ```

- **After**

  ```ts
  const { login, logout } = useAuthentication()

  login({ username, password }) // 'login' success message shown and 'login' event tracked
  logout() // 'logout' success or error message and 'logout' event tracked
  ```
