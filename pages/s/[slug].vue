<template>
  <CMSServicePageData :slug="slug">
    <template #default="{ data, pending }">
      <div v-if="pending" class="container space-y-2 py-4">
        <SkeletonLoader type="headline" class="mb-10" />
        <SkeletonLoader type="custom" class="h-6 w-72" />
        <SkeletonLoader type="custom" class="h-6 w-48" />
        <SkeletonLoader type="custom" class="h-6 w-96" />
        <SkeletonLoader type="custom" class="h-6 w-72" />
      </div>
      <div v-else-if="data" class="container">
        <div class="py-4">
          <Breadcrumbs
            :items="[
              { value: 'Home', to: routeList.home },
              {
                value: data.name,
                to: data.slug,
              },
            ]"
          />
        </div>
        <CMSStory :story="data" />
      </div>
    </template>
  </CMSServicePageData>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() =>
  Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug,
)

useSeoMeta({
  robots: 'index,follow',
  title: _capitalize(slug.value),
})

defineOptions({ name: 'ServicesPage' })
definePageMeta({ pageType: 'service_pages' })
</script>
