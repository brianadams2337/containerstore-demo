<template>
  <div v-if="fetching" class="container space-y-2 py-4">
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
        ]" />
    </div>
    <Story :story="story" />
  </div>
</template>

<script setup lang="ts">
import type { SbContentPage } from '~/storyblok/types/storyblok.gen'

const route = useRoute()
const slug = computed(() => route.params.slug)
const {
  fetchBySlug,
  fetching,
  status,
  data: story,
  error,
} = useCms<SbContentPage>(`services-page-${slug.value}`)

if (status.value === 'idle') {
  await fetchLazy(fetchBySlug(`s/${slug.value}`))
}

if (error.value) {
  throw error.value
}

defineOptions({ name: 'ServicesPage' })
</script>
