<template>
  <div
    class="flex min-h-screen flex-col text-primary antialiased anchor-scrolling-none"
  >
    <PromotionBanner
      v-if="allCurrentPromotions.length"
      :promotions="allCurrentPromotions"
    />
    <HeaderMetaBar />
    <AppHeader />
    <ToastContainer />
    <MobileSidebar />
    <div class="mt-4 grow">
      <NuxtPage />
    </div>
    <CMSAppFooterData class="mt-16" />
  </div>
</template>

<script setup lang="ts">
import {
  USE_BANNER_KEY,
  USE_DEFAULT_BREAKPOINTS_KEY,
  USE_TRACKING_EVENTS_KEY,
  createContext,
} from '~/composables/cms/useProviderContext'

// Initialize data
await useWishlist()
await useBasket()
await useRootCategories()
const { allCurrentPromotions } = await useBasketPromotions()
const trackingEvents = useTrackingEvents()

createContext(USE_TRACKING_EVENTS_KEY, trackingEvents)
createContext(USE_DEFAULT_BREAKPOINTS_KEY, useDefaultBreakpoints())
createContext(USE_BANNER_KEY, useBanner())

const { data: _promotionData } = await useCurrentPromotions()

trackingEvents.trackShopInit()
await trackingEvents.listenToUserItemsChanges()
await trackingEvents.listenToCustomerDataChanges()

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
