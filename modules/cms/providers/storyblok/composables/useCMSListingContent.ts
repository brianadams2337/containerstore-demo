import type {
  SbListingPage,
  SbStory,
} from '../types'

export function useCMSListingContent(data: Ref<SbStory<SbListingPage> | null>) {
  return {
    content: computed(() => data.value?.data.story.content || {}),
    preListingContent: computed(
      () => data.value?.data.story.content?.pre_listing_content || [],
    ),
    postListingContent: computed(
      () => data.value?.data.story.content?.post_listing_content || [],
    ),
    hasTeaserImage: computed(() =>
      Boolean(data.value?.data.story.content.teaser_image?.filename),
    ),
  }
}
