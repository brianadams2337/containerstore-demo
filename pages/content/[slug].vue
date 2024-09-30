<template>
  <CMSContentPageData :slug="slug">
    <template #default="{ data, pending }">
      <div v-if="pending" class="mx-4 xl:container">
        <div class="w-full max-w-xl">
          <SFSkeletonLoader class="mb-10 w-full" full-width />
        </div>
        <SFSkeletonLoader type="custom" class="h-6 w-72" />
        <SFSkeletonLoader type="custom" class="h-6 w-48" />
        <SFSkeletonLoader type="custom" class="mb-10 h-6 w-72" />
        <SFSkeletonLoader type="custom" class="h-40 w-full" />
      </div>

      <template v-else-if="data">
        <CMSImage
          v-if="
            ('teaser_image' in data.content || 'teaser_image' in data) &&
            data.content['teaser_image']?.filename
          "
          :blok="{
            ...('teaser_image' in data.content ? data.content : data),
            _uid: data.uuid,
            component: 'CmsImage',
          }"
          is-teaser
          is-cover
          class="h-[12.5rem] w-full sm:mb-0"
        />
        <div class="mx-4 xl:container">
          <SFBreadcrumbs
            class="py-4"
            :items="[
              { value: 'Home', to: routeList.home },
              { value: data.name, to: data.slug },
            ]"
          />

          <CMSStory :story="data" />
        </div>
      </template>
    </template>
  </CMSContentPageData>
</template>

<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import { computed, defineOptions } from 'vue'
import { definePageMeta } from '#imports'
import { useRoute } from '#app/composables/router'
import { routeList } from '~/utils'
import { SFSkeletonLoader, SFBreadcrumbs } from '#storefront-ui/components'
import CMSContentPageData from '#storefront-cms/components/fetching/CMSContentPageData.vue'
import CMSStory from '#storefront-cms/components/Story.vue'
import CMSImage from '#storefront-cms/components/Image.vue'

const route = useRoute()
const slug = computed(() =>
  Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug,
)

useSeoMeta({
  robots: 'index,follow',
  title: slug.value.charAt(0).toUpperCase() + slug.value.slice(1),
})

defineOptions({ name: 'ContentPage' })
definePageMeta({ pageType: 'content_pages' })
</script>
