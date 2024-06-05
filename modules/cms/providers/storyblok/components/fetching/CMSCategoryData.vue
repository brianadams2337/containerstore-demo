<script setup lang="ts">
import { useRoute } from '#app/composables/router'
import type {
  SbCmsImage,
  SbListingPage,
} from '../../types'
import { useCMS } from '../../composables/useCMS'
import { useCMSListingContent } from '../../composables/useCMSListingContent'
import { useStoryblokEditor } from '../../composables/useStoryblokEditor'
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

<template>
  <div>
    <slot
      v-bind="{
        content: content as SbCmsImage,
        hasTeaserImage,
        postListingContent,
        preListingContent,
      }"
    />
  </div>
</template>
