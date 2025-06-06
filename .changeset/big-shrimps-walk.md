---
'@scayle/storefront-application-nuxt': patch
---

**\[Accessibility\]** Improved keyboard navigation and focus management on the Product List Page.
When navigating between categories using the side navigation, focus is now correctly retained within the navigation panel.
This was achieved by preventing the PLP from re-rendering on category changes via setting a fixed key in `definePageMeta`:

```typescript
definePageMeta({
  // ...
  key: 'PLP',
})
```

Because the PLP component no longer re-mounts when changing categories, any logic previously in an `onMounted()` hook will not run again on navigation.
This logic must be moved to a watcher (e.g., watching `route.params` or category state) to ensure it executes correctly.
