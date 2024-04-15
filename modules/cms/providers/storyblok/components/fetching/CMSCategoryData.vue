<script setup lang="ts">
import type {
  SbCmsImage,
  SbListingPage,
} from '~/modules/cms/providers/storyblok/types'
import { useCMS } from '~/modules/cms/providers/storyblok/composables/useCMS'
import { useCMSListingContent } from '~/modules/cms/providers/storyblok/composables/useCMSListingContent'
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
