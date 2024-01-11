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

  const storyblokApi = useStoryblokApi()
  const storyblokOptions = useDefaultStoryblokOptions()

  async function fetchBySlug(slug: string) {
    status.value = 'pending'
    fetching.value = true

    try {
      const { data: storyData } = await storyblokApi.get(
        `cdn/stories/${slug}`,
        storyblokOptions,
      )

      data.value = storyData.story
    } catch (e) {
      error.value = handleCmsError(e)
      log.error(`Error fetching CMS Slug: ${slug}`, e)
    } finally {
      fetching.value = false
      status.value = error.value ? 'error' : 'success'
    }
  }

  async function fetchByFolder(folder: string, options?: ISbStoriesParams) {
    fetching.value = true
    status.value = 'pending'

    try {
      const {
        data: { stories },
      } = await storyblokApi.getStories({
        ...storyblokOptions,
        starts_with: folder,
        ...options,
      })

      data.value = stories as unknown as StoryblokStory<T>
    } catch (e) {
      error.value = handleCmsError(e)
      log.error(`Error fetching CMS Folder`, e)
    } finally {
      fetching.value = false
      status.value = error.value ? 'error' : 'success'
    }
  }

  return { fetchBySlug, data, fetchByFolder, fetching, status, error }
}
