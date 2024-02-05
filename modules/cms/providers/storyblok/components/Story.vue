<template>
  <div>
    <StoryblokComponent :blok="story.content" />
  </div>
</template>

<script setup lang="ts">
import type { SbSeo } from '../types/storyblok'

const props = defineProps({
  story: {
    type: Object as PropType<{ [key: string]: any }>,
    required: true,
  },
})

const cmsSeoContent = props.story.content.SEO as SbSeo
useSeoMeta({
  description: cmsSeoContent?.description,
  robots: 'index,follow',
  twitterTitle: cmsSeoContent?.twitter_description,
  twitterDescription: cmsSeoContent?.twitter_description,
  twitterImage: cmsSeoContent?.twitter_image,
  ogTitle: cmsSeoContent?.og_title,
  ogDescription: cmsSeoContent?.og_description,
  ogImage: cmsSeoContent?.og_image,
})

defineOptions({ name: 'CmsStory' })
</script>
