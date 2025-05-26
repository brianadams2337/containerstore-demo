---
'@scayle/storefront-application-nuxt': patch
---

Replaced `useRootCategories` with `useCategoryTree` for optimized category tree retrieval. This reduces custom implementation complexity in SCAYLE Storefront by leveraging functionality provided by `@scayle/storefront-nuxt`.

`useCategoryTree` always returns a `Category[]` list removing the need to check the returned value and mapping it if necessary.

```ts
const { data: rootCategoriesData, status, error } = useRootCategories()

const rootCategories = computed<Category[]>(() => {
  if (!rootCategoriesData.value) {
    return []
  }
  return Array.isArray(rootCategoriesData.value.categories)
    ? rootCategoriesData.value.categories
    : [rootCategoriesData.value.categories]
})

// will become

const { data: rootCategoriesData, status, error } = useCategoryTree()

const rootCategories = computed<Category[]>(() => {
  return rootCategoriesData.value ?? []
})
```
