import type { ISbStoriesParams } from 'storyblok-js-client'

export default function useCMS<_T = unknown>(key: string) {
  const storyblokApi = useStoryblokApi()
  const storyblokOptions = useDefaultStoryblokOptions()

  async function fetchBySlug(
    slug: string,
    options: {
      immediate: boolean
    } = {
      immediate: false,
    },
  ) {
    return await useAsyncData(
      key,
      () => storyblokApi.get(`cdn/stories/${slug}`, storyblokOptions),
      options,
    )
  }

  async function fetchByFolder(
    folder: string,
    options?: ISbStoriesParams,
    asyncDataOption: {
      immediate: boolean
    } = {
      immediate: false,
    },
  ) {
    return await useAsyncData(
      key,
      () =>
        storyblokApi.getStories({
          ...storyblokOptions,
          starts_with: folder,
          ...options,
        }),
      asyncDataOption,
    )
  }

  return { fetchBySlug, fetchByFolder }
}
