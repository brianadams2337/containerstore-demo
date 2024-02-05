import type { ISbStoriesParams } from 'storyblok-js-client'

const DRAFT_ALLOWED_ENVS = ['staging', 'integration', 'development']

export function useDefaultStoryblokOptions(): Pick<
  ISbStoriesParams,
  'language' | 'version'
> {
  const route = useRoute()
  const config = useRuntimeConfig()
  const currentShop = useCurrentShop()
  const env = config.public.appEnv

  return {
    version:
      env && DRAFT_ALLOWED_ENVS.includes(env) && route.query._storyblok
        ? 'draft'
        : 'published',
    language: currentShop.value.locale ?? '',
  }
}
