<template>
  <div v-if="fetching" class="container mx-auto space-y-2 py-4">
    <div class="w-full max-w-xl">
      <SkeletonLoader class="mb-10 w-full" full-width />
    </div>
    <SkeletonLoader type="custom" class="h-6 w-72" />
    <SkeletonLoader type="custom" class="h-6 w-48" />

    <SkeletonLoader type="custom" class="mb-10 h-6 w-72" />
    <SkeletonLoader type="custom" class="h-40 w-full" />
  </div>

  <div v-else-if="story">
    <div v-if="'teaser_image' in story.content">
      <CmsImage :blok="{ ...story.content, component: 'CmsImage' }" is-teaser />
    </div>
    <div class="container">
      <div class="py-4">
        <Breadcrumbs
          :items="[
            { value: 'Home', to: routeList.home.name },
            { value: story.name, to: story.slug },
          ]"
        >
        </Breadcrumbs>
      </div>
      <Story :story="story" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SbContentPage } from '~/modules/cms/providers/storyblok/types/storyblok.gen'

const route = useRoute()
const slug = computed(() => route.params.slug)
const { fetchBySlug } = useCMS<SbContentPage>(`content-page-${slug}`)
const fetching = ref()
const story = ref()
const status = ref()
if (status.value === 'idle') {
  const {
    data,
    pending,
    status: _status,
    execute: _fetchBySlug,
  } = await fetchBySlug(`c/${slug.value}`)
  story.value = data.value
  fetching.value = pending.value
  status.value = _status.value
  await fetchLazy(_fetchBySlug())
}

defineOptions({ name: 'ContentPage' })
definePageMeta({ pageType: 'content_pages' })
</script>
