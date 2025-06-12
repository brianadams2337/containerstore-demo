---
'@scayle/storefront-application-nuxt': minor
---

**\[UI\]** Enhanced and simplified Tailwind configuration for `box-shadows`.

Extracted CSS variables within `main.css`:

```css
@layer base {
  :root {
    --color-shadow-navy: 25 49 70;
    --color-shadow-gray: 204 204 204;
    --color-shadow-white-smoke: 0, 0, 0, 0.1;
  }
}
```

Tailwind Configuration:

```ts
export default {
  theme: {
    boxShadow: {
      none: 'none',
      DEFAULT:
        '0 4px 6px -1px rgba(var(--color-shadow-white-smoke)), 0 2px 4px -2px rgba(var(--color-shadow-white-smoke))',
      'inner-solid': 'inset 0 0 0 4px rgb(var(--color-shadow-navy))',
      'inner-solid-sm': 'inset 0 0 0 2px rgb(var(--color-shadow-navy))',
      'outer-solid': '0 0 0 3px rgb(var(--color-shadow-navy))',
      'input-label':
        'inset 0 2px 8px -10px rgb(var(--color-shadow-gray)), inset 0 2px 8px -10px rgb(var(--color-shadow-gray))',
    },
  },
}
```
