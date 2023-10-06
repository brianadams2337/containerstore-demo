import { StoryblokStory } from '@aboutyou/storyblok-generate-ts'
import { NuxtError } from 'nuxt/app'
import { ISbStoriesParams } from 'storyblok-js-client'

const handleCmsError = (error: any): NuxtError => {
  const err = JSON.parse(error) as { status: number; message: string }
  const parsedError = { statusCode: err.status, statusMessage: err.message }
  return createError(parsedError)
}

type Status = 'idle' | 'pending' | 'success' | 'error'

export default <T = unknown>(key: string) => {
  const log = useLog(`useCms ${key}`)
  const data = useState<StoryblokStory<T>>(`cms-data-${key}`)
  const fetching = useState<boolean>(`fetching-${key}`)
  const status = useState<Status>(`status-${key}`, () => 'idle')
  const error = useState<NuxtError | undefined>(`error-${key}`, () => undefined)

  const storyblokApi = useStoryblokApi()

  async function fetchBySlug(slug: string) {
    status.value = 'pending'
    fetching.value = true
    try {
      const { data: storyData } = await storyblokApi.get(
        `cdn/stories/${slug}`,
        {
          version: getStoryblokContentVersion(),
        },
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
        starts_with: folder,
        version: getStoryblokContentVersion(),
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
