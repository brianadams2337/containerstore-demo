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
import { useCMS } from '../../composables/useCMS'
import { useCMSListingContent } from '../../composables/useCMSListingContent'
import { useContentfulEditor } from '../../composables/useContentfulEditor'
import { useRoute } from '#app/composables/router'

const props = defineProps<{
  selectedCategory: number | undefined
}>()

const route = useRoute()

const { fetchBySlug } = useCMS(`ListingPage-${route.path}`)

if (!props.selectedCategory) {
  console.log('No category selected')
}
const { data } = await fetchBySlug<TypeListingPageSkeleton>({
  content_type: 'listingPage',
  'fields.slug[match]': `categories/${props.selectedCategory}`,
})
const { content, hasTeaserImage, postListingContent, preListingContent } =
  useCMSListingContent(
    data as unknown as Ref<TypeListingPageWithoutUnresolvableLinksResponse>,
  )

useContentfulEditor<TypeListingPageSkeleton>(data)
</script>
