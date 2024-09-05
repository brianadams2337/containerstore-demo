<template>
  <div>
    <slot
      :content="content as SbCmsImage"
      :has-teaser-image="hasTeaserImage"
      :pre-listing-content="preListingContent"
      :post-listing-content="postListingContent"
    />
  </div>
</template>

<script setup lang="ts">
import type { SbListingPage, SbCmsImage } from '../../types'
import { useCMSBySlug } from '../../composables/useCMS'
import { useCMSListingContent } from '../../composables/useCMSListingContent'
import { useStoryblokEditor } from '../../composables/useStoryblokEditor'
import { useRoute } from '#app/composables/router'

const props = defineProps<{
  selectedCategory: number | undefined
}>()

const route = useRoute()

if (!props.selectedCategory) {
  console.log('No category selected')
}
const { data } = await useCMSBySlug<SbListingPage>(
  `ListingPage-${route.path}`,
  // NOTE:We need to pass both the `c/` path, as well as the prefix `c-` plus
  // the selected categoryID to the useCMSBySlug composables.
  // Storyblok requires also to set `c-{selectedCategory} to be set as `Slug`
  // within the related story.
  // This allows the Storyblok Preview functionality to properly work.
  `c/c-${props.selectedCategory}`,
)

useStoryblokEditor<SbListingPage>(data)

const { content, hasTeaserImage, postListingContent, preListingContent } =
  useCMSListingContent(data)
</script>
