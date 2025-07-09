---
'@scayle/storefront-application-nuxt': minor
---

**\[UI\]** To simplify responsive design and improve maintainability, the application's breakpoints have been streamlined.
The `2xl` breakpoint has been removed to focus on a more essential set of screen sizes.
Developers should now target the `xl` breakpoint as the largest available size for any screen-specific styling.

- Available Breakpoints:

  ```ts
  // config/ui.ts
  export const BREAKPOINTS = {
    xs: 320,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  }
  ```
