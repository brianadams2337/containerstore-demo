<template>
  <footer class="bg-white" data-testid="footer">
    <div class="flex flex-col gap-5 border-t p-5 md:gap-8 md:px-10 md:py-7">
      <SFLocalizedLink
        :to="routeList.home"
        raw
        :aria-label="shopName"
        data-testid="footer-logo"
        class="flex w-7"
      >
        <IconNewLogo class="size-7" aria-hidden="true" />
      </SFLocalizedLink>

      <div class="grid grid-cols-1 gap-y-5 text-base md:grid-cols-4">
        <SFFooterLinkSection
          v-for="section in footerLinks?.items"
          :key="section.id"
          :section="section"
        />
      </div>
    </div>

    <div
      class="flex flex-col gap-4 border-t p-5 text-md md:flex-row md:gap-8 md:py-7"
    >
      <SFBottomFooter />
    </div>
  </footer>
</template>

<script setup lang="ts">
import SFFooterLinkSection from './SFFooterLinkSection.vue'
import SFLocalizedLink from './SFLocalizedLink.vue'
import SFBottomFooter from './SFBottomFooter.vue'
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
