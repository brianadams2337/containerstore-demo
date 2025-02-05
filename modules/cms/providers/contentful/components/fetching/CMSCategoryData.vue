<template>
  <div>
    <slot
      :content="content"
      :has-teaser-image="hasTeaserImage"
      :post-listing-content="postListingContent"
      :pre-listing-content="preListingContent"
    />
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import type {
  TypeListingPageSkeleton,
  TypeListingPageWithoutUnresolvableLinksResponse,
} from '../../types'
import { useCMSBySlug } from '../../composables/useCMS'
import { useCMSListingContent } from '../../composables/useCMSListingContent'
import { useContentfulEditor } from '../../composables/useContentfulEditor'
import { useRoute } from '#app/composables/router'

const { selectedCategory } = defineProps<{ selectedCategory?: number }>()

const route = useRoute()

if (!selectedCategory) {
  console.log('No category selected')
}
const { data } = await useCMSBySlug<TypeListingPageSkeleton>(
  `ListingPage-${route.path}`,
  {
    content_type: 'listingPage',
    // NOTE:We need to pass both the `c/` path, as well as the prefix `c-` plus
    // the selected categoryID to the useCMSBySlug composables.
    // Contentful requires also to set `c/c-{selectedCategory} to be set as `Slug`
    // within the related story.
    // This allows the Contentful Preview functionality to properly work.
    'fields.slug[match]': `c/c-${selectedCategory}`,
  },
)
const { content, hasTeaserImage, postListingContent, preListingContent } =
  useCMSListingContent(
    data as unknown as Ref<TypeListingPageWithoutUnresolvableLinksResponse>,
  )

useContentfulEditor<TypeListingPageSkeleton>(data)
</script>
