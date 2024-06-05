<template>
  <div>
    <div data-test-id="home-page-content">
      <CMSIndexData slug="home">
        <template #default="{ data }">
          <CMSStory v-if="data" :story="data" />
        </template>
      </CMSIndexData>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineOptions, onMounted } from 'vue'
import { useHead, useSeoMeta } from '@unhead/vue'
import { definePageMeta } from '#imports'
import { sanitizeCanonical } from '~/utils/seo'
import {
  useTracking,
  useTrackingEvents,
  wishlistListingMetadata,
} from '~/composables'
import { useWishlist } from '#storefront/composables'
import { useNuxtApp, useRuntimeConfig } from '#app/nuxt'
import { useRoute } from '#app/composables/router'

const config = useRuntimeConfig()
const route = useRoute()

const { $i18n } = useNuxtApp()

const wishlist = await useWishlist()

const { hasEventInQueue } = useTracking()

const { trackWishlist, collectProductListItems } = useTrackingEvents()

useSeoMeta({ robots: 'index,follow', title: $i18n.t('navigation.home') })

useHead({
  link: [
    {
      rel: 'canonical',
      key: 'canonical',
      href: sanitizeCanonical(`${config.public.baseUrl}${route?.fullPath}`),
    },
  ],
})

onMounted(() => {
  if (hasEventInQueue('wishlist')) {
    return
  }
  trackWishlist(
    collectProductListItems(wishlist.products.value, {
      listId: wishlistListingMetadata.id,
      listName: wishlistListingMetadata.name,
    }),
  )
})

defineOptions({ name: 'HomePage' })
definePageMeta({ pageType: 'homepage' })
</script>
