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
const fetching = ref()
const status = ref()
const story = ref()
const error = ref()
if (status.value === 'idle') {
  const {
    data,
    pending,
    status: _status,
    error: _error,
    execute: _fetchBySlug,
  } = await fetchBySlug(`s/${slug.value}`)
  story.value = data.value
  fetching.value = pending.value
  status.value = _status.value
  error.value = _error.value
  await fetchLazy(_fetchBySlug())
}

if (error.value) {
  throw error.value
}

defineOptions({ name: 'ServicesPage' })
</script>
