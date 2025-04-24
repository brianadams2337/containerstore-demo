---
'@scayle/storefront-application-nuxt': patch
---

**\[Accessibility\]** Improved keyboard navigation in the side navigation on the PLP. Focus is now retained when navigating between categories.

This enhancement was achieved by setting a fixed key in the PLP using:

```typescript
definePageMeta({
  //...
  key: 'PLP',
})
```

With this change, the PLP is no longer re-rendered when switching categories — components remain mounted, ensuring a smoother and more accessible user experience.
Additionally, since the PLP is no longer remounted on category changes, any logic previously placed in onMounted() will no longer run automatically on navigation. Such code should now be triggered explicitly when the category changes — for example, by watching the category state or route params.
