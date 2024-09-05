import type { ISbStoriesParams } from 'storyblok-js-client'
import { useStoryblokApi } from '@storyblok/vue'
import type { SbStory } from '../types/storyblok'
import { useDefaultStoryblokOptions } from './useDefaultStoryblokOptions'
import { useAsyncData, type AsyncDataOptions } from '#app/composables/asyncData'

export function useCMSBySlug<T>(
  key: string,
  slug: string,
  asyncDataOption?: AsyncDataOptions<SbStory<T>>,
) {
  const storyblokApi = useStoryblokApi()
  const storyblokOptions = useDefaultStoryblokOptions()
  return useAsyncData(
    key,
    () =>
      storyblokApi.get(`cdn/stories/${slug}`, {
        ...storyblokOptions,
      }) as unknown as Promise<SbStory<T>>,
    asyncDataOption,
  )
}

export function useCMSByFolder<T>(
  key: string,
  folder: string,
  params?: ISbStoriesParams,
  asyncDataOption?: AsyncDataOptions<SbStory<T>>,
) {
  const storyblokApi = useStoryblokApi()
  const storyblokOptions = useDefaultStoryblokOptions()
  return useAsyncData(
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
