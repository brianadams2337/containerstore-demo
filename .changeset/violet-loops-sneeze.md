---
'@scayle/storefront-application-nuxt': minor
---

**\[UI\]** Enhanced Tailwind configuration for `outline`, `outline-offset`, `border-width`, and `border-radius`.

Key Changes:

- Simplified `outline` and `outline-offset` configuration by removing redundant values.
- Removed custom [border-radius](https://v3.tailwindcss.com/docs/border-radius) and [border-width](https://v3.tailwindcss.com/docs/border-width) values to align with Tailwind's default values for consistency and maintainability.

Updated Configuration for Outline Values:

```ts
export default {
  theme: {
    extend: {
      outlineWidth: {
        0: '0',
        1: '1px',
        2: '2px',
        3: '3px',
      },
      outlineOffset: {
        0: '0',
        1: '1px',
        2: '2px',
        4: '4px',
        5: '5px',
      },
    },
  },
}
```
