<template>
  <footer class="bg-white" data-testid="footer">
    <div class="flex flex-col gap-5 border-t p-5 md:gap-8 md:px-10 md:py-7">
      <LocalizedLink
        :to="routeList.home"
        raw
        :aria-label="shopName"
        data-testid="footer-logo"
        class="flex w-7"
      >
        <IconNewLogo class="size-7" aria-hidden="true" />
      </LocalizedLink>

      <div class="grid grid-cols-1 gap-y-5 text-base md:grid-cols-4">
        <FooterLinkSection
          v-for="section in footerLinks?.items"
          :key="section.id"
          :section="section"
        />
      </div>
    </div>

    <div
      class="flex flex-col gap-4 border-t p-5 text-md md:flex-row md:gap-8 md:py-7"
    >
      <BottomFooter />
    </div>
  </footer>
</template>

<script setup lang="ts">
import FooterLinkSection from './FooterLinkSection.vue'
import LocalizedLink from './LocalizedLink.vue'
import BottomFooter from './BottomFooter.vue'
import { useNuxtApp } from '#app/nuxt'
import { useNavigationTreeByName } from '#storefront/composables'
import { routeList } from '~/utils/route'

const {
  $config: {
    public: { shopName },
  },
} = useNuxtApp()

const { data: footerLinks } = useNavigationTreeByName(
  {
    params: { treeName: 'Footer' },
  },
  'footer-tree',
)
</script>
