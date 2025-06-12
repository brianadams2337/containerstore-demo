---
'@scayle/storefront-application-nuxt': minor
---

**\[UI\]** Enhanced Tailwind configuration for `spacing` and `sizes`.

Configuration is refined for `width`, `minWidth`, `maxWidth`, `height`, `minHeight`, `maxHeight`, `spacing`, and `padding`.
These updates ensure a consistent and scalable design system.

Key Changes:

The `spacing` scale now serves as the foundation for multiple core plugins, including
margin, gap, inset, space, translate, scrollMargin, and scrollPadding.
To maintain uniformity, all values are centralized within the `spacing` property,
which incorporates `defaultSizes` defined at the top of the Tailwind config file.

Additionally, `spacing` and other sizing values (`maxHeight` and `maxWidth`)
are extended within the `theme.extend` property, leveraging the
[default Tailwind spacing scale](https://v3.tailwindcss.com/docs/customizing-spacing#default-spacing-scale).

Updated Configuration:

```ts
const defaultSizes = {
  '6xs': '2rem',
  '5xs': '4rem',
  '4xs': '8rem',
  '3xs': '12rem',
  '2xs': '16rem',
  xs: '20rem',
  md: '28rem',
  lg: '32rem',
  xl: '36rem',
  '2xl': '40rem',
  '3xl': '48rem',
}

export default {
  theme: {
    extend: {
      maxHeight: {
        dialog: '94vh',
      },
      maxWidth: {
        screen: '100vw',
        dialog: '94vw',
      },
      spacing: {
        ...defaultSizes,
        '4.5': '1.125rem',
        11: '2.625rem',
        13: '3.25rem',
        15: '3.75rem',
        22: '5.5rem',
        26: '6.5rem',
      },
    },
  },
}
```

These improvements streamline the configuration, making it more intuitive and adaptable for future design needs.
