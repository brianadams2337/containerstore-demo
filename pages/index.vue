<template>
  <div>
    <div data-test-id="home-page-content">
      <Story v-if="data" :story="data" />
    </div>
  </div>
</template>

<script setup lang="ts">
const storyblokOptions = useDefaultStoryblokOptions()
const data = await useAsyncStoryblok('home', storyblokOptions)

const config = useRuntimeConfig()
const route = useRoute()

const wishlist = await useWishlist()

const { hasEventInQueue } = useTracking()

const { trackWishlist, collectProductListItems } = useTrackingEvents()

useSeoMeta({ robots: 'index,follow' })
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
