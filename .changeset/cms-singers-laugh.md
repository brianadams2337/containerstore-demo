---
'@scayle/storefront-boilerplate-nuxt': patch
---

CMS: Fixed possible composable misuse errors

`useCMS` has been split into `useCMSBySlug` and `useCMSByFolder` to avoid possible errors caused by calling a composable outside the appropriate context. This applies to both the Contentful and Storyblok providers.

Before:

```ts
const { fetchBySlug } = useCMS('some-key')
const { data } = fetchBySlug('some-slug')
```

After:

```ts
const { data } = useCMSBySlug('some-key', 'some-slug')
```
