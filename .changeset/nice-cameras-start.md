---
'@scayle/storefront-application-nuxt': minor
---

**\[UI\]** Enhanced and simplified Tailwind configuration for `font-sizes` and `line heights`.

Key Changes:

The font size scale has been refined for better usability and consistency. The following font sizes have been removed:
`3xs`, `2xs`, `base`, `4xl`, `5xl`, `6xl`, `7xl`.

- **New Progression:** The font size scale now aligns closely with Tailwind's default numerical progression.
  - `3xs` and `2xs` are replaced with `xs`.
  - `base` is replaced with `md`.

Line heights have also been streamlined:

- The `2.5` and `3.5` values has been removed.
- The configuration retains Tailwind's default line heights, ensuring compatibility across the application.

Updated Configuration:

```ts
export default {
  theme: {
    fontSize: {
      xs: [
        '0.625rem', // 10px
        {
          lineHeight: '0.875rem',
          letterSpacing: '0.09px',
        },
      ],
      sm: [
        '0.75rem', // 12px
        {
          lineHeight: '1rem',
          letterSpacing: '-0.13px',
        },
      ],
      md: [
        '0.875rem', // 14px
        {
          lineHeight: '1.125rem',
          letterSpacing: '-0.14px',
        },
      ],
      lg: [
        '1rem', // 16px
        {
          lineHeight: '1.25rem',
          letterSpacing: '-0.32px',
        },
      ],
      xl: [
        '1.125rem', // 18px
        {
          lineHeight: '1.375rem',
          letterSpacing: '0',
        },
      ],
      '2xl': [
        '1.25rem', // 20px
        {
          lineHeight: '1.75rem',
          letterSpacing: '-0.4px',
        },
      ],
      '3xl': [
        '1.75rem', // 28px
        {
          lineHeight: '2rem',
          letterSpacing: '-0.5px',
        },
      ],
    },
  },
}
```

These updates make the configuration more intuitive, future-proof, and adaptable
to evolving design needs. By aligning with Tailwind's default progression,
the setup ensures consistency while maintaining flexibility for creative designs.
