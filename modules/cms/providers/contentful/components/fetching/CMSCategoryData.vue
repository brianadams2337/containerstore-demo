<script setup lang="ts">
import type {
  TypeListingPageSkeleton,
  TypeListingPageWithoutUnresolvableLinksResponse,
} from '~/modules/cms/providers/contentful/types'
import { useCMS } from '~/modules/cms/providers/contentful/composables/useCMS'
import { useCMSListingContent } from '~/modules/cms/providers/contentful/composables/useCMSListingContent'
import { useContentfulEditor } from '~/modules/cms/providers/contentful/composables/useContentfulEditor'

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

<template>
  <div>
    <slot
      v-bind="{
        content,
        hasTeaserImage,
        postListingContent,
        preListingContent,
      }"
    />
  </div>
</template>
