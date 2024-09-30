<template>
  <CMSServicePageData :slug="slug">
    <template #default="{ data, pending }">
      <div v-if="pending" class="mx-4 xl:container">
        <SFSkeletonLoader type="headline" class="mb-10" />
        <SFSkeletonLoader type="custom" class="h-6 w-72" />
        <SFSkeletonLoader type="custom" class="h-6 w-48" />
        <SFSkeletonLoader type="custom" class="h-6 w-96" />
        <SFSkeletonLoader type="custom" class="h-6 w-72" />
      </div>

      <div v-else-if="data" class="mx-4 xl:container">
        <SFBreadcrumbs
          :items="[
            { value: 'Home', to: routeList.home },
            { value: data.name, to: data.slug },
          ]"
        />

        <CMSStory :story="data" />
      </div>
    </template>
  </CMSServicePageData>
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { useRoute } from '#app/composables/router'
import { definePageMeta } from '#imports'
import { routeList } from '~/utils'
import { SFSkeletonLoader, SFBreadcrumbs } from '#storefront-ui/components'
import CMSServicePageData from '#storefront-cms/components/fetching/CMSServicePageData.vue'
import CMSStory from '#storefront-cms/components/Story.vue'

const route = useRoute()
const slug = computed(() =>
  Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug,
)

useSeoMeta({
  robots: 'index,follow',
  title: slug.value.charAt(0).toUpperCase() + slug.value.slice(1),
})

defineOptions({ name: 'ServicesPage' })
definePageMeta({ pageType: 'service_pages' })
</script>
