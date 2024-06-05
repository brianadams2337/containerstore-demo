<template>
  <div>
    <CMSStoryblokComponent :blok="story.content" />
  </div>
</template>

<script setup lang="ts">
import { defineOptions , computed } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import type { SbSeo } from '../types'

const props = defineProps<{
  story: {
    [key: string]: any
  }
}>()
const seo = computed<SbSeo>(() => props.story.content.seo)

useSeoMeta({
  description: seo.value?.description,
  robots: 'index,follow',
  twitterTitle: seo.value?.twitter_description,
  twitterDescription: seo.value?.twitter_description,
  twitterImage: seo.value?.twitter_image,
  ogTitle: seo.value?.og_title,
  ogDescription: seo.value?.og_description,
  ogImage: seo.value?.og_image,
})

defineOptions({ name: 'CMSStory' })
</script>
