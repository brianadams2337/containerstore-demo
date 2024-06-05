<template>
  <div>
    <CMSContentfulComponent :blok="props.story" />
  </div>
</template>

<script setup lang="ts">
import { defineOptions , computed } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import type { TypeContentPageWithoutUnresolvableLinksResponse } from '../types'
const props = defineProps<{
  story: any
}>()

const seoData = computed(() => {
  if (!props.story?.fields?.seo) {
    return {
      description: '',
      title: '',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
    }
  }
  const story = props.story as TypeContentPageWithoutUnresolvableLinksResponse
  return {
    description: story.fields.seo?.fields?.description ?? '',
    title: story.fields.seo?.fields.title ?? '',
    robots: 'index,follow',
    twitterTitle: story.fields.seo?.fields.twitterTitle ?? '',
    twitterDescription: story.fields.seo?.fields.twitterDescription ?? '',
    twitterImage: story.fields.seo?.fields.twitterImage?.fields.file?.url ?? '',
    ogTitle: story.fields.seo?.fields.ogTitle ?? '',
    ogDescription: story.fields.seo?.fields.ogDescription ?? '',
    ogImage: story.fields.seo?.fields.ogImage?.fields.file?.url ?? '',
  }
})

useSeoMeta({
  description: seoData.value.description,
  title: seoData.value.title,
  robots: 'index,follow',
  twitterTitle: seoData.value.twitterTitle,
  twitterDescription: seoData.value.twitterDescription,
  twitterImage: seoData.value.twitterImage,
  ogTitle: seoData.value.ogTitle,
  ogDescription: seoData.value.ogDescription,
  ogImage: seoData.value.ogImage,
})

defineOptions({ name: 'CMSStory' })
</script>
