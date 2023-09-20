import { StoryblokStory } from '@aboutyou/storyblok-generate-ts'
import { SbListingPage } from '~/storyblok/types/storyblok.gen'

const useCmsListingContent = (data: Ref<StoryblokStory<SbListingPage>>) => {
  const content = computed(() => data.value?.content)
  return {
    content,
    preListingContent: computed(
      () => data.value?.content?.pre_listing_content || [],
    ),
    postListingContent: computed(
      () => data.value?.content?.post_listing_content || [],
    ),
    hasTeaserImage: computed(() =>
      Boolean(content.value?.teaser_image?.filename),
    ),
  }
}

export default useCmsListingContent
