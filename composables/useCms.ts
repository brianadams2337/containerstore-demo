import { StoryblokStory } from '@aboutyou/storyblok-generate-ts'
import { ISbStoriesParams } from 'storyblok-js-client'
import { SbListingPage } from '~/storyblok/types/storyblok.gen'

type StoryblokFolder = 'lookbooks' | 'test'

export default (key: string) => {
  const data = useState<StoryblokStory<SbListingPage>>(`cms-data-${key}`)
  const fetching = useState<boolean>(`fetching-${key}`)
  async function fetchBySlug(slug: string) {
    if (!slug) {
      return data
    }
    fetching.value = true
    try {
      const storyData = await useAsyncStoryblok(slug, {
        version: getStoryblokContentVersion(),
      })
      data.value = storyData.value
    } catch (e) {
      console.error(`Error fetching CMS Slug`, e)
    } finally {
      fetching.value = false
    }
  }

  // Limitation of useStoryblokAsync not being able to fetch multiple stories, thus as a work around using storyblokApi
  // https://github.com/storyblok/storyblok-nuxt/issues/547#issuecomment-1697844103
  const storyblokApi = useStoryblokApi()
  async function fetchByFolder(
    folder: StoryblokFolder,
    options?: ISbStoriesParams,
  ) {
    fetching.value = true
    try {
      const {
        data: { stories },
      } = await storyblokApi.getStories({
        starts_with: folder,
        version: getStoryblokContentVersion(),
        ...options,
      })
      // TODO fix type
      data.value = stories as any
    } catch (e) {
      console.error(`Error fetching CMS Folder`, e)
    } finally {
      fetching.value = false
    }
  }

  return { fetchBySlug, data, fetchByFolder, fetching }
}
