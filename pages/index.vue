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
