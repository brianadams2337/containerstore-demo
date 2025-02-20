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
import { sanitizeCanonicalURL } from '@scayle/storefront-nuxt'
import type { OnlineStore, WithContext } from 'schema-dts'
import { definePageMeta } from '#imports'
import { useNuxtApp, useRuntimeConfig } from '#app'
import { useRoute } from '#app/composables/router'
import CMSIndexData from '#storefront-cms/components/fetching/CMSIndexData.vue'
import CMSStory from '#storefront-cms/components/Story.vue'
import { useI18n } from '#i18n'
import { useJsonld } from '~/composables/useJsonld'

const config = useRuntimeConfig()
const route = useRoute()

const { t } = useI18n()

useSeoMeta({ robots: 'index,follow', title: t('navigation.home') })

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
