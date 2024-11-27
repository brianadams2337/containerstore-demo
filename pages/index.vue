<template>
  <div>
    <div data-testid="home-page-content">
      <CMSIndexData slug="home">
        <template #default="{ data }">
          <CMSStory v-if="data" :story="data" />
        </template>
      </CMSIndexData>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'
import { useHead, useSeoMeta } from '@unhead/vue'
import { definePageMeta } from '#imports'
import { sanitizeCanonicalURL } from '~/utils/seo'
import { useNuxtApp, useRuntimeConfig } from '#app'
import { useRoute } from '#app/composables/router'
import CMSIndexData from '#storefront-cms/components/fetching/CMSIndexData.vue'
import CMSStory from '#storefront-cms/components/Story.vue'

const config = useRuntimeConfig()
const route = useRoute()

const { $i18n } = useNuxtApp()

useSeoMeta({ robots: 'index,follow', title: $i18n.t('navigation.home') })

useHead({
  link: [
    {
      rel: 'canonical',
      key: 'canonical',
      href: sanitizeCanonicalURL(`${config.public.baseUrl}${route?.fullPath}`),
    },
  ],
})

defineOptions({ name: 'HomePage' })
definePageMeta({ pageType: 'homepage' })
</script>
