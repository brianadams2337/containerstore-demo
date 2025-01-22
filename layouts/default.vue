<template>
  <div
    class="flex min-h-screen flex-col text-primary antialiased anchor-scrolling-none"
  >
    <SFSkipLinks v-model:is-mobile-sidebar-open="isMobileSidebarOpen" />
    <SFPromotionBanner
      v-if="shouldShowPromotionBanner"
      :promotions="allCurrentPromotions"
    />
    <SFToastContainer />
    <CountryDetection @switch-shop="switchShop" />
    <div
      class="translate-y-0 transition-transform duration-300 ease-in-out"
      :class="{ 'lg:-translate-y-13': !isPromotionBannerShown }"
    >
      <SFHeaderTopBar />
      <SFHeader v-model:is-mobile-sidebar-open="isMobileSidebarOpen" />
      <main id="main-content" class="grow focus:outline-none" tabindex="-1">
        <NuxtPage />
      </main>
      <SFFooter
        class="max-lg:mb-4"
        :class="{
          'lg:translate-y-13': !isPromotionBannerShown,
          'mt-16': shouldShowPromotionBanner,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineOptions, onMounted, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute } from '#app/composables/router'
import { useNuxtApp } from '#app/nuxt'
import { useCurrentPromotions, useCurrentShop } from '#storefront/composables'
import {
  USE_BANNER_KEY,
  USE_DEFAULT_BREAKPOINTS_KEY,
  USE_TRACKING_EVENTS_KEY,
  createContext,
  useBanner,
  useBasketPromotions,
  useTrackingEvents,
  usePromotionActions,
  useUserItemsTrackingWatcher,
  useCustomerDataChangeWatcher,
} from '~/composables'
import SFHeaderTopBar from '~/components/layout/headers/SFHeaderTopBar.vue'
import CountryDetection, {
  type ShopInfo,
} from '~/components/SFCountryDetection.vue'
import SFPromotionBanner from '~/components/promotion/SFPromotionBanner.vue'
import { useDefaultBreakpoints } from '#storefront-ui/composables'
import { SFToastContainer } from '#storefront-ui/components'
import { NuxtPage } from '#components'
import SFSkipLinks from '~/components/SFSkipLinks.vue'
import SFFooter from '~/components/SFFooter.vue'
import SFHeader from '~/components/layout/headers/SFHeader.vue'
import { routeList } from '~/utils'
import { useShopSwitcher } from '~/composables/useShopSwitcher'
import { useLocalePath } from '#i18n'

const { changeShop } = useShopSwitcher()

const route = useRoute()

const localePath = useLocalePath()

// Initialize data
const { allCurrentPromotions } = useBasketPromotions()

const isMobileSidebarOpen = ref(false)

const { isPromotionBannerShown } = usePromotionActions()

const trackingEvents = useTrackingEvents()
useUserItemsTrackingWatcher()
useCustomerDataChangeWatcher()

createContext(USE_TRACKING_EVENTS_KEY, trackingEvents)
createContext(USE_DEFAULT_BREAKPOINTS_KEY, useDefaultBreakpoints())
createContext(USE_BANNER_KEY, useBanner())

const { data: _promotionData } = useCurrentPromotions()
const currentShop = useCurrentShop()

const shouldShowPromotionBanner = computed(() => {
  const isBasketPage = route.path === localePath(routeList.basket)
  return allCurrentPromotions.value.length && !isBasketPage
})

onMounted(() => trackingEvents.trackShopInit())

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
  titleTemplate: (title) => (title ? `${title} | ${shopName}` : `${shopName}`),
})

const switchShop = (shop: ShopInfo) => {
  changeShop(shop.path, shop.locale)
}
defineOptions({ name: 'AppDefault' })
</script>
