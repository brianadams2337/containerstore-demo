---
'@scayle/storefront-application-nuxt': minor
---

**\[UI\]** The color palette has been streamlined and unified
within the Tailwind configuration for improved consistency and simplicity.

The most notable refinements are in the `gray` and `secondary` color variants,
which have been thoughtfully reduced to enhance usability and clarity.
New gray and secondary color definitions are as follows:

```ts
{
  gray: {
    100: '#fafafa',
    200: '#f2f2f2',
    300: '#ebebeb',
    400: '#d9d9d9',
    500: '#a8a8a8',
  },
  secondary: '#666666',
}
```

Furthermore, `white-smoke`, `focus`, and `primary-400` colors has been removed,
replacing them with carefully selected alternatives that align with the updated design system.
