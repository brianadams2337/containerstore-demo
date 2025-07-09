---
'@scayle/storefront-application-nuxt': patch
---

**\[PLP\]** The category fetching logic has been updated to exclude categories that contain no products.
This change automatically removes them from the PLP side navigation for a cleaner interface.

```ts
// /pages/c.vue

const { data: rootCategories, status } = useCategoryTree(
  {
    params: {
      children: 5,
      properties: { withName: ['sale'] },
    },
  },
  'category-navigation-tree',
)

// was changed to

const { data: rootCategories, status } = useCategoryTree(
  {
    params: {
      children: 5,
      properties: { withName: ['sale'] },
      hideEmptyCategories: true,
    },
  },
  'category-navigation-tree',
)
```
