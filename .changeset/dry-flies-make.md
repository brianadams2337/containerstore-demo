---
'@scayle/storefront-application-nuxt': patch
---

**\[Architecture\]** To reduce code and complexity when fetching categories, `useRootCategories` has been removed in favor of `useCategoryTree`.
The new method is more efficient and guarantees a consistent `Category[]` return value.

```ts
// BEFORE
const { data: rootCategoriesData, status, error } = useRootCategories()

const rootCategories = computed<Category[]>(() => {
  if (!rootCategoriesData.value) {
    return []
  }
  return Array.isArray(rootCategoriesData.value.categories)
    ? rootCategoriesData.value.categories
    : [rootCategoriesData.value.categories]
})

// AFTER
const { data: rootCategoriesData, status, error } = useCategoryTree()

const rootCategories = computed<Category[]>(() => {
  return rootCategoriesData.value ?? []
})
```
