---
'@scayle/storefront-boilerplate-nuxt': minor
---

Replace the composable `useCategorySeoData` with `useProductListingSeoData` from `@scayle/storefront-product-listing`.

Old implementation:

```ts
const {
  title,
  metaDescription,
  robots,
  canonicalLink,
  categoryBreadcrumbSchema,
} = useCategorySeoData(currentCategory)
```

New implementation:

```ts
const route = useRoute()
const { getBreadcrumbsFromCategory } = useBreadcrumbs()

const breadcrumbs = computed(() =>
  currentCategory.value
    ? getBreadcrumbsFromCategory(currentCategory.value, true)
    : [],
)

const { title, robots, canonicalLink, categoryBreadcrumbSchema } =
  useProductListingSeoData(breadcrumbs.value, route, {
    baseUrl: $config.public.baseUrl,
    fullPath: route.fullPath,
  })
```
