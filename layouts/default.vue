<template>
  <div
    class="flex min-h-screen flex-col text-primary antialiased anchor-scrolling-none"
  >
    <PromotionBanner
      v-if="allCurrentPromotions.length"
      :promotions="allCurrentPromotions"
    />
    <SFToastContainer />
    <CountryDetection @switch-shop="switchShop" />
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
      <AppFooter
        class="mt-16"
        :class="{ 'lg:translate-y-[3.25rem]': !isPromotionBannerShown }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineOptions, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useNuxtApp } from '#app/nuxt'
import { useSwitchLocalePath } from '#i18n'
import { useCurrentPromotions, useCurrentShop } from '#storefront/composables'
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
import CountryDetection, {
  type ShopInfo,
} from '~/components/CountryDetection.vue'
import PromotionBanner from '~/components/promotion/PromotionBanner.vue'
import { SFToastContainer } from '#storefront-ui/components'
import { NuxtPage } from '#components'
import AppFooter from '~/components/AppFooter.vue'

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
const currentShop = useCurrentShop()

onMounted(async () => {
  trackingEvents.trackShopInit()
})
const {
  $config: {
    public: { shopName },
  },
} = useNuxtApp()
// Meta tags
useHead({
  bodyAttrs: () => ({
    class: ['relative'],
  }),
  htmlAttrs: () => ({
    lang: new Intl.Locale(currentShop.value.locale).language,
  }),
  script: [
    {
      // Add loaded class to body after DOMContentLoaded
      children: `document.addEventListener('DOMContentLoaded', () => { document.body.classList.add('loaded'); });`,
    },
  ],
  titleTemplate: (title) => (title ? `${title} - ${shopName}` : `${shopName}`),
})

const switchLocalePath = useSwitchLocalePath()
const switchShop = (shop: ShopInfo) => {
  trackingEvents.trackShopChange()
  if (shop.path) {
    window.location.replace(switchLocalePath(shop.path).split('?')[0])
  }
}

defineOptions({ name: 'AppDefault' })
</script>
