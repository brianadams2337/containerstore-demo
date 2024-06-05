import type { ISbStoriesParams } from 'storyblok-js-client'
import { useStoryblokApi } from '@storyblok/vue'
import type { SbStory } from '../types/storyblok'
import type { AsyncDataOptions } from '#app'

export function useCMS(key: string) {
  const storyblokApi = useStoryblokApi()
  const storyblokOptions = useDefaultStoryblokOptions()
  async function fetchBySlug<T>(
    slug: string,
    asyncDataOption?: AsyncDataOptions<SbStory<T>>,
  ) {
    return await useAsyncData(
      key,
      () =>
        storyblokApi.get(`cdn/stories/${slug}`, {
          ...storyblokOptions,
        }) as unknown as Promise<SbStory<T>>,
      asyncDataOption,
    )
  }

  async function fetchByFolder<T>(
    folder: string,
    params?: ISbStoriesParams,
    asyncDataOption?: AsyncDataOptions<SbStory<T>>,
  ) {
    return await useAsyncData(
      key,
      () => {
        return storyblokApi.getStories({
          ...storyblokOptions,
          starts_with: folder,
          ...params,
        }) as unknown as Promise<SbStory<T>>
      },
      asyncDataOption,
    )
  }

  return { storyblokOptions, fetchBySlug, fetchByFolder }
}
