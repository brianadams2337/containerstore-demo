<template>
  <div
    class="flex min-h-screen flex-col text-primary antialiased anchor-scrolling-none"
  >
    <PromotionBanner
      v-if="allCurrentPromotions.length"
      :promotions="allCurrentPromotions"
    />
    <SFToastContainer />
    <CountryDetection />
    <div
      class="translate-y-0 transition-transform duration-300 ease-in-out"
      :class="{ 'lg:translate-y-[-3.25rem]': !isPromotionBannerShown }"
    >
      <HeaderMetaBar />
      <AppHeader />
      <MobileSidebar />
      <div class="mt-8 grow">
        <NuxtPage />
      </div>
      <CMSAppFooterData
        class="mt-16"
        :class="{ 'lg:translate-y-[3.25rem]': !isPromotionBannerShown }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineOptions, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useCurrentPromotions } from '#storefront/composables'
import {
  USE_BANNER_KEY,
  USE_DEFAULT_BREAKPOINTS_KEY,
  USE_TRACKING_EVENTS_KEY,
  createContext,
  useBanner,
  useBasketPromotions,
  useDefaultBreakpoints,
  useTrackingEvents,
  usePromotionActions,
  useUserItemsTrackingWatcher,
  useCustomerDataChangeWatcher,
} from '~/composables'
import HeaderMetaBar from '~/components/layout/headers/HeaderMetaBar.vue'
import AppHeader from '~/components/layout/headers/AppHeader.vue'
import MobileSidebar from '~/components/layout/navigation/MobileSidebar.vue'
import CountryDetection from '~/components/CountryDetection.vue'
import PromotionBanner from '~/components/promotion/PromotionBanner.vue'
import CMSAppFooterData from '#storefront-cms/components/fetching/CMSAppFooterData.vue'
import { SFToastContainer } from '#storefront-ui/components'
import { NuxtPage } from '#components'

// Initialize data
const { allCurrentPromotions } = useBasketPromotions()

const { isPromotionBannerShown } = usePromotionActions()

const trackingEvents = useTrackingEvents()
useUserItemsTrackingWatcher()
useCustomerDataChangeWatcher()

createContext(USE_TRACKING_EVENTS_KEY, trackingEvents)
createContext(USE_DEFAULT_BREAKPOINTS_KEY, useDefaultBreakpoints())
createContext(USE_BANNER_KEY, useBanner())

const { data: _promotionData } = useCurrentPromotions()

onMounted(async () => {
  trackingEvents.trackShopInit()
})

// Meta tags
useHead({
  bodyAttrs: () => ({
    class: ['relative'],
  }),
  script: [
    {
      // Add loaded class to body after DOMContentLoaded
      children: `document.addEventListener('DOMContentLoaded', () => { document.body.classList.add('loaded'); });`,
    },
  ],
})

defineOptions({ name: 'AppDefault' })
</script>
