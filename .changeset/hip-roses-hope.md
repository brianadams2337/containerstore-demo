---
'@scayle/storefront-boilerplate-nuxt': patch
---

## Introducing Contentful integration

We've added a Contentful integration as alternative to using Storyblok as CMS provider. This allows you to fetch data from Contentful and use it in your SFB.
To use this feature, you need to provide your Contentful space ID and access token in the `.env` file. You can find these values in your Contentful account settings.

```env
NUXT_PUBLIC_CMS_ACCESS_TOKEN=your-access-token
NUXT_PUBLIC_CMS_SPACE=your-space-id
```

Once you have added these values, you can use Contentful by selecting the `contentful` option in the `cms.provider` field of the `nuxt.config.ts` file.

```ts
export default defineNuxtConfig({
  // ...
  cms: {
    provider: 'contentful',
  },
  // ...
})
```

Now you have access to `useCMS` composables and fetch data from Contentful in your SFB. `useCMS` accepts a string as an argument that will be used for caching purposes and returns a `fetchBySlug` function that you can use to fetch data by slug. `fetchBySlug` is a wrapper around Nuxt's `useAsyncData` and accepts a generic type that you can use to define the shape of the data you are fetching. Here is and example of how you can use this feature:

```ts
import type { TypeListingPageSkeleton } from '~/modules/cms/providers/contentful/types/contentful-defs'

const props = defineProps<{
  selectedCategory: number | undefined
}>()

const route = useRoute()

if (!props.selectedCategory) {
  console.log('No category selected')
}
const { fetchBySlug } = useCMS(`ListingPage-${route.path}`)

const { data } = await fetchBySlug<TypeListingPageSkeleton>(
  `categories/${props.selectedCategory}`,
)
```
