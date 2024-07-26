<template>
  <CMSContentPageData :slug="slug">
    <template #default="{ data, pending }">
      <div v-if="pending" class="container mx-auto space-y-2 py-4">
        <div class="w-full max-w-xl">
          <SFSkeletonLoader class="mb-10 w-full" full-width />
        </div>
        <SFSkeletonLoader type="custom" class="h-6 w-72" />
        <SFSkeletonLoader type="custom" class="h-6 w-48" />

        <SFSkeletonLoader type="custom" class="mb-10 h-6 w-72" />
        <SFSkeletonLoader type="custom" class="h-40 w-full" />
      </div>

      <div v-else-if="data">
        <div v-if="'teaser_image' in data.content">
          <CMSImage
            :blok="{ ...data.content, _uid: data.uuid, component: 'CmsImage' }"
            is-teaser
          />
        </div>
        <div class="container">
          <div class="py-4">
            <SFBreadcrumbs
              :items="[
                { value: 'Home', to: routeList.home.name },
                { value: data.name, to: data.slug },
              ]"
            />
          </div>
          <CMSStory :story="data" />
        </div>
      </div>
    </template>
  </CMSContentPageData>
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import { definePageMeta } from '#imports'
import { useRoute } from '#app/composables/router'
import { routeList } from '~/utils'

const route = useRoute()
const slug = computed(() =>
  Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug,
)

defineOptions({ name: 'ContentPage' })
definePageMeta({ pageType: 'content_pages' })
</script>
