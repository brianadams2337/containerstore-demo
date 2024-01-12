import type { StoryblokStory } from 'storyblok-generate-ts'
import type { NuxtError } from 'nuxt/app'
import type { ISbStoriesParams, ISbError } from 'storyblok-js-client'

type Status = 'idle' | 'pending' | 'success' | 'error'

const handleCmsError = (error: any): NuxtError => {
  const { status, message } = JSON.parse(error) as ISbError
  return createError({ statusCode: status, statusMessage: message })
}

export function useCms<T = unknown>(key: string) {
  const log = useLog(`useCms ${key}`)
  const data = useState<StoryblokStory<T>>(`cms-data-${key}`)
  const fetching = useState<boolean>(`fetching-${key}`)
  const status = useState<Status>(`status-${key}`, () => 'idle')
  const error = useState<NuxtError | undefined>(`error-${key}`, () => undefined)

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
