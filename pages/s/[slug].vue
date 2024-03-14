<template>
  <div v-if="pending" class="container space-y-2 py-4">
    <SkeletonLoader type="headline" class="mb-10" />

    <SkeletonLoader type="custom" class="h-6 w-72" />
    <SkeletonLoader type="custom" class="h-6 w-48" />
    <SkeletonLoader type="custom" class="h-6 w-96" />
    <SkeletonLoader type="custom" class="h-6 w-72" />
  </div>
  <div v-else-if="story" class="container">
    <div class="py-4">
      <Breadcrumbs
        :items="[
          { value: 'Home', to: routeList.home },
          { value: story.name, to: story.slug },
        ]"
      />
    </div>
    <Story :story="story" />
  </div>
</template>

<script setup lang="ts">
import type { SbContentPage } from '~/modules/cms/providers/storyblok/types/storyblok.gen'

const route = useRoute()
const slug = computed(() => route.params.slug)
const { fetchBySlug } = useCMS<SbContentPage>(`services-page-${slug.value}`)

const {
  data,
  pending,
  error,
  execute: _fetchBySlug,
} = await fetchBySlug(`s/${slug.value}`)

await fetchLazy(_fetchBySlug())

const story = computed(() => data.value?.data.story)

if (error.value) {
  throw error.value
}

useSeoMeta({
  robots: 'index,follow',
  title: _capitalize(slug.value.toString()),
})

defineOptions({ name: 'ServicesPage' })
definePageMeta({ pageType: 'service_pages' })
</script>
