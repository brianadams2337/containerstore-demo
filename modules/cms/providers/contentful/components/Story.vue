<template>
  <div>
    <CMSContentfulComponent :blok="props.story" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import type { Entry } from 'contentful'
import type { TypeContentPageWithoutUnresolvableLinksResponse } from '../types'
import CMSContentfulComponent from './ContentfulComponent.vue'

const props = defineProps<{
  story: Entry
}>()

const story = computed(
  () => props.story as TypeContentPageWithoutUnresolvableLinksResponse,
)

const seo = computed(() => {
  return story.value.fields?.seo?.fields
})

useSeoMeta({
  description: seo.value?.description ?? '',
  title: seo.value?.title ?? story.value.fields.headline ?? '',
  robots: 'index,follow',
  twitterTitle: seo.value?.twitterTitle ?? '',
  twitterDescription: seo.value?.twitterDescription ?? '',
  twitterImage: seo.value?.twitterImage?.fields?.file?.url ?? '',
  ogTitle: seo.value?.ogTitle ?? '',
  ogDescription: seo.value?.ogDescription ?? '',
  ogImage: seo.value?.ogImage?.fields?.file?.url ?? '',
})

defineOptions({ name: 'CMSStory' })
</script>
