<template>
  <CMSContentPage slug="homepage" data-testid="home-page-content">
    <template #loading>
      <SFContentPageSkeletonLoader />
    </template>
  </CMSContentPage>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'
import { sanitizeCanonicalURL } from '@scayle/storefront-nuxt'
import type { OnlineStore, WithContext } from 'schema-dts'
import { useHead, useSeoMeta, definePageMeta } from '#imports'
import { useNuxtApp, useRuntimeConfig } from '#app'
import { useRoute } from '#app/composables/router'
import CMSContentPage from '#storefront-cms/components/ContentPage.vue'
import { useJsonld } from '~/composables/useJsonld'
import SFContentPageSkeletonLoader from '~/components/SFContentPageSkeletonLoader.vue'

const config = useRuntimeConfig()
const route = useRoute()

useSeoMeta({ robots: 'index,follow' })

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

const {
  $config: {
    public: { baseUrl, shopName },
  },
} = useNuxtApp()

useJsonld(
  () =>
    ({
      '@context': 'https://schema.org',
      '@type': 'OnlineStore',
      name: shopName,
      url: baseUrl,
      logo: `${baseUrl}/logo.svg`,
    }) as WithContext<OnlineStore>,
)
</script>
