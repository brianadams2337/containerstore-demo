<template>
  <div v-if="fetching">
    <SkeletonLoader full-width class="h-[700px]" />
  </div>
  <div v-else-if="!lookbooksData" class="flex h-[700px]">
    <p class="m-auto">
      Seems like you dont have any lookbooks for now, head over to the CMS and
      start creating your first lookbook!
    </p>
  </div>
  <div v-else class="mb-24">
    <div v-for="story in lookbooksData" :key="story.uuid">
      <DefaultLink
        v-if="routeList.lookbooks.parameter"
        raw
        :to="{
          name: routeList.lookbooks.name,
          params: {
            [routeList.lookbooks.parameter]: prepareForUrl(story.name),
          },
        }">
        <NuxtPicture
          class="picture picture-contain hidden w-full sm:block"
          height="800px"
          provider="storyblok"
          :src="story.content.teaser_image.filename"
          :alt="story.content.teaser_image.alt" />
        <NuxtPicture
          v-if="story.content.teaser_image_mobile"
          class="picture picture-contain w-full sm:hidden"
          provider="storyblok"
          :src="story.content.teaser_image_mobile.filename"
          :alt="story.content.teaser_image_mobile.alt" />
      </DefaultLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { slugify } from '@scayle/storefront-nuxt'
import { SbListingPage } from '~/storyblok/types/storyblok.gen'

const {
  fetchByFolder,
  data: lookbooksData,
  fetching,
  status,
} = useCms<SbListingPage>('lookbooks')
if (status.value === 'idle') {
  await fetchLazy(fetchByFolder('lookbooks', { per_page: 5 }))
}
const prepareForUrl = (path: string) => slugify(path)
definePageMeta({ pageType: 'lookbooks' })
</script>
