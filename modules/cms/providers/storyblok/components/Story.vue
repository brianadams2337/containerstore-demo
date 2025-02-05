<template>
  <div>
    <CMSStoryblokComponent :blok="story.content" />
  </div>
</template>

<script setup lang="ts" generic="T extends StoryblokComponentType<string>">
import { computed, defineOptions } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import type { ISbStoryData, StoryblokComponentType } from '@storyblok/vue'
import type { SbSeo, SbContentPage, SbPage } from '../types'
import CMSStoryblokComponent from './CMSStoryblokComponent.vue'

export type ContentType = NonNullable<
  SbContentPage['content'] | SbPage['content']
>

const { story } = defineProps<{ story: ISbStoryData<T> }>()

const seo = computed<SbSeo>(() => {
  return (story.content as unknown as { seo: SbSeo }).seo
})

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
