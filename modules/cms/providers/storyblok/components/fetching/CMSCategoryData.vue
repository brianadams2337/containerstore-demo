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
import { useCMS } from '../../composables/useCMS'
import { useCMSListingContent } from '../../composables/useCMSListingContent'
import { useStoryblokEditor } from '../../composables/useStoryblokEditor'
import { useRoute } from '#app/composables/router'

const props = defineProps<{
  selectedCategory: number | undefined
}>()

const route = useRoute()

const { fetchBySlug } = useCMS(`ListingPage-${route.path}`)

if (!props.selectedCategory) {
  console.log('No category selected')
}
const { data } = await fetchBySlug<SbListingPage>(
  `categories/${props.selectedCategory}`,
)
useStoryblokEditor<SbListingPage>(data)

const { content, hasTeaserImage, postListingContent, preListingContent } =
  useCMSListingContent(data)
</script>
