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
        }"
      >
        <NuxtPicture
          class="picture picture-contain hidden w-full sm:block"
          height="800px"
          provider="storyblok"
          :src="story.content.teaser_image.filename"
          :alt="story.content.teaser_image.alt"
        />
        <NuxtPicture
          v-if="story.content.teaser_image_mobile"
          class="picture picture-contain w-full sm:hidden"
          provider="storyblok"
          :src="story.content.teaser_image_mobile.filename"
          :alt="story.content.teaser_image_mobile.alt"
        />
      </DefaultLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { slugify } from '@scayle/storefront-nuxt'
import type { SbListingPage } from '~/modules/cms/providers/storyblok/types/storyblok.gen'

const { fetchByFolder } = useCMS<SbListingPage>('lookbooks')
const lookbooksData = ref()
const fetching = ref()
const status = ref()

if (status.value === 'idle') {
  const {
    data,
    pending,
    status: _status,
    execute: _fetchByFolder,
  } = await fetchByFolder('lookbooks', {
    per_page: 5,
  })
  lookbooksData.value = data.value
  fetching.value = pending.value
  status.value = _status.value
  await fetchLazy(_fetchByFolder())
}
const prepareForUrl = (path: string) => slugify(path)

defineOptions({ name: 'LookbooksPage' })
definePageMeta({ pageType: 'lookbooks' })
</script>
