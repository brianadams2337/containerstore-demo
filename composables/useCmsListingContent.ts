import type { StoryblokStory } from 'storyblok-generate-ts'
import type { SbListingPage } from '~/storyblok/types/storyblok.gen'

export function useCmsListingContent(data: Ref<StoryblokStory<SbListingPage>>) {
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
