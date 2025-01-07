<template>
  <div
    class="flex min-h-screen flex-col text-primary antialiased anchor-scrolling-none"
  >
    <div
      id="a11y-skip-links"
      class="flex h-0 items-center justify-center gap-4 opacity-0 focus-within:h-20 focus-within:opacity-100"
    >
      <SFButton
        variant="secondary"
        :aria-label="$t('a11y.skip_to_main')"
        @click="focusMainContent"
      >
        {{ $t('a11y.skip_to_main') }}
      </SFButton>
      <SFButton
        variant="secondary"
        :aria-label="$t('a11y.skip_to_search')"
        @click="focusSearch"
      >
        {{ $t('a11y.skip_to_search') }}
      </SFButton>
    </div>
    <SFPromotionBanner
      v-if="allCurrentPromotions.length"
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
        class="mt-16 max-lg:mb-4"
        :class="{ 'lg:translate-y-13': !isPromotionBannerShown }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineOptions, nextTick, onMounted, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { useNuxtApp } from '#app/nuxt'
import { useSwitchLocalePath, type Locale } from '#i18n'
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
import { SFToastContainer, SFButton } from '#storefront-ui/components'
import { NuxtPage } from '#components'
import SFFooter from '~/components/SFFooter.vue'
import SFHeader from '~/components/layout/headers/SFHeader.vue'

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
    window.location.replace(switchLocalePath(shop.path as Locale).split('?')[0])
  }
}

const isMobileSidebarOpen = ref(false)
const { greaterOrEqual } = useDefaultBreakpoints()
const isDesktopLayout = greaterOrEqual('lg')
/**
 * Provides a way to skip all focusable elements and jump directly to the search field.
 * This improves accessibility by allowing users to bypass navigation links and other repetitive elements.
 *
 * @see https://webaim.org/techniques/skipnav/
 */
const focusSearch = async () => {
  const id = isDesktopLayout.value ? 'search-desktop' : 'search-mobile'
  const search = document.getElementById(id)
  const form = search?.querySelector('form')

  if (!search || !form) {
    return
  }

  if (!isDesktopLayout.value) {
    isMobileSidebarOpen.value = true
    await nextTick()
  }

  form.focus({ preventScroll: true })
}

/**
 * Provides a way to skip all focusable elements and jump directly to the main content.
 * This improves accessibility by allowing users to bypass navigation links and other repetitive elements.
 *
 * @see https://webaim.org/techniques/skipnav/
 */
const focusMainContent = () => {
  document.querySelector('main')?.focus({ preventScroll: true })
}

defineOptions({ name: 'AppDefault' })
</script>
