<template>
  <div
    class="flex min-h-screen flex-col overflow-hidden text-primary antialiased anchor-scrolling-none"
  >
    <PromotionBanner
      v-if="allCurrentPromotions.length"
      :promotions="allCurrentPromotions"
      @change="updateLayout"
    />
    <div
      class="translate--y-0 transition-transform duration-300 ease-in-out"
      :class="{ 'lg:translate-y-[-3.25rem]': isLayoutTranslated }"
    >
      <HeaderMetaBar />
      <AppHeader />
      <SFToastContainer />
      <MobileSidebar />
      <div class="mt-4 grow">
        <NuxtPage />
      </div>
      <CMSAppFooterData
        class="mt-16"
        :class="{ 'lg:translate-y-[3.25rem]': isLayoutTranslated }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineOptions, onMounted, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { useCurrentPromotions, useWishlist } from '#storefront/composables'
import {
  USE_BANNER_KEY,
  USE_DEFAULT_BREAKPOINTS_KEY,
  USE_TRACKING_EVENTS_KEY,
  createContext,
  useBanner,
  useBasketPromotions,
  useDefaultBreakpoints,
  useRootCategories,
  useSideNavigation,
  useTrackingEvents,
} from '~/composables'
import { useModal } from '#storefront-ui/composables'

// Initialize data
const [{ allCurrentPromotions }] = await Promise.all([
  useBasketPromotions(), // This covers basket fetch so we don't need to fetch it here
  useWishlist(),
  useRootCategories(),
])

const isLayoutTranslated = ref(false)

const updateLayout = (value: boolean) => {
  isLayoutTranslated.value = !value
}

const trackingEvents = useTrackingEvents()

createContext(USE_TRACKING_EVENTS_KEY, trackingEvents)
createContext(USE_DEFAULT_BREAKPOINTS_KEY, useDefaultBreakpoints())
createContext(USE_BANNER_KEY, useBanner())

const { data: _promotionData } = await useCurrentPromotions()

onMounted(async () => {
  trackingEvents.trackShopInit()
  await trackingEvents.listenToUserItemsChanges()
  await trackingEvents.listenToCustomerDataChanges()
})

// Meta tags
const { isSideNavigationOpen } = useSideNavigation()
const { isOpen: isModalOpen } = useModal()

useHead({
  bodyAttrs: () => ({
    class: [
      'relative',
      isSideNavigationOpen.value || isModalOpen.value
        ? 'overflow-hidden h-full'
        : '',
    ],
  }),
})

defineOptions({ name: 'AppDefault' })
</script>
