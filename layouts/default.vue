<template>
  <div
    class="flex min-h-screen flex-col text-primary antialiased anchor-scrolling-none"
  >
    <SFSkipLinks v-model:is-mobile-sidebar-open="isMobileSidebarOpen" />

    <SFToastContainer />
    <CountryDetection @switch-shop="switchShop" />
    <div>
      <SFPromotionRibbon
        v-if="
          promotions?.entities.length &&
          shouldShowPromotionRibbon &&
          !isMobileSidebarOpen
        "
        :promotions="promotions.entities"
      />
      <SFHeaderTopBar />
      <SFHeader v-model:is-mobile-sidebar-open="isMobileSidebarOpen" />
      <main
        id="main-content"
        class="grow focus:outline-none"
        tabindex="-1"
        data-testid="main-content"
      >
        <NuxtPage />
      </main>
      <SFFooter class="mt-16 max-lg:mb-4" />
    </div>
    <SFPromotionSlideIn :promotions="promotions?.entities"/>
    <SFShopSwitcherFlyout />
  </div>
</template>

<script setup lang="ts">
import { computed, defineOptions, onMounted, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { whenever } from '@vueuse/core'
import { useRoute } from '#app/composables/router'
import { useNuxtApp } from '#app/nuxt'
import {
  useCurrentPromotions,
  useCurrentShop,
  useBasket,
} from '#storefront/composables'
import {
  USE_BANNER_KEY,
  USE_DEFAULT_BREAKPOINTS_KEY,
  USE_TRACKING_EVENTS_KEY,
  createContext,
  useBanner,
  useTrackingEvents,
  useUserItemsTrackingWatcher,
  useCustomerDataChangeWatcher,
} from '~/composables'
import SFHeaderTopBar from '~/components/layout/headers/SFHeaderTopBar.vue'
import CountryDetection, {
  type ShopInfo,
} from '~/components/SFCountryDetection.vue'
import { useDefaultBreakpoints } from '#storefront-ui/composables'
import { SFToastContainer } from '#storefront-ui/components'
import { NuxtPage } from '#components'
import SFSkipLinks from '~/components/SFSkipLinks.vue'
import SFFooter from '~/components/SFFooter.vue'
import SFHeader from '~/components/layout/headers/SFHeader.vue'
import { routeList } from '~/utils'
import { useShopSwitcher } from '~/composables/useShopSwitcher'
import { useLocalePath } from '#i18n'
import SFShopSwitcherFlyout from '~/components/layout/headers/SFShopSwitcherFlyout.vue'
import SFPromotionRibbon from '~/components/promotion/SFPromotionRibbon.vue'
import { useApplyPromotions } from '#storefront-promotions/composables/useApplyPromotions'
import SFPromotionSlideIn from '~/components/promotion/modal/SFPromotionSlideIn.vue'

const { changeShop } = useShopSwitcher()

const route = useRoute()

const localePath = useLocalePath()

// Initialize data
const { data: promotions } = useCurrentPromotions()

const isMobileSidebarOpen = ref(false)

const trackingEvents = useTrackingEvents()
useUserItemsTrackingWatcher()
useCustomerDataChangeWatcher()

createContext(USE_TRACKING_EVENTS_KEY, trackingEvents)
createContext(USE_DEFAULT_BREAKPOINTS_KEY, useDefaultBreakpoints())
createContext(USE_BANNER_KEY, useBanner())

const { data: _promotionData } = useCurrentPromotions()
const currentShop = useCurrentShop()

const shouldShowPromotionRibbon = computed(() => {
  const isBasketPage = route.path === localePath(routeList.basket)
  const isOSP = route.path === localePath(routeList.osp)
  return promotions.value?.entities.length && !isBasketPage && !isOSP
})

const { data: basketData } = useBasket()
const { applyPromotions } = useApplyPromotions()

// Update promotions in case a user with items in the basket returned to the shop.
// While the user was gone, new promotions might have been added that could be added to the basket items.
whenever(
  basketData,
  () => {
    applyPromotions(basketData)
  },
  { once: true },
)

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
