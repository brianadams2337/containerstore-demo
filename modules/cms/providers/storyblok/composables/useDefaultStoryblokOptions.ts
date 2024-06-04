import type { ISbStoriesParams } from 'storyblok-js-client'

export function useDefaultStoryblokOptions(): Pick<
  ISbStoriesParams,
  'language' | 'version'
> {
  const route = useRoute()
  const currentShop = useCurrentShop()

  return {
    version: route.query._storyblok ? 'draft' : 'published',
    language: currentShop.value.locale ?? '',
  }
}
