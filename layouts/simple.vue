<template>
  <div
    class="flex min-h-screen flex-col text-primary antialiased anchor-scrolling-none"
  >
    <header
      class="relative flex h-15 items-center justify-between border-b px-7 text-md font-medium text-gray-900"
    >
      <SFLocalizedLink
        :to="routeList.home"
        raw
        class="flex items-center gap-2 rounded-md p-1 text-md font-medium text-primary hover:bg-gray-100"
      >
        <IconBack aria-hidden="true" class="size-3" />
        <div class="mr-auto hidden pt-0.5 md:block">
          {{ $t('global.back-to-shop') }}
        </div>
        <div class="mr-auto block pt-0.5 md:hidden">
          {{ $t('global.to-shop') }}
        </div>
      </SFLocalizedLink>

      <SFLocalizedLink
        :to="routeList.home"
        raw
        class="absolute left-1/2 -translate-x-1/2"
        :aria-label="shopName"
      >
        <IconNewLogo class="size-7" aria-hidden="true" />
      </SFLocalizedLink>

      <nav class="hidden flex-row gap-4 md:flex">
        <SFNavigationTreeItem
          v-for="navItem in headerTree?.items"
          :key="`footer-link-${navItem.id}`"
          raw
          class="rounded-md p-1 hover:bg-gray-100"
          :navigation-item="navItem"
        />
        <span class="ml-auto" />
      </nav>
    </header>
    <main class="grow">
      <NuxtPage />
    </main>
    <footer
      class="flex flex-col gap-4 border-t bg-gray-50 px-10 py-5 text-base text-gray-600 md:flex-row md:gap-8 md:py-7 md:text-gray-900"
    >
      <SFBottomFooter />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'
import { useHead } from '@unhead/vue'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'
import { useNuxtApp } from '#app/nuxt'
import {
  useCurrentShop,
  useNavigationTreeByName,
} from '#storefront/composables'
import { NuxtPage } from '#components'
import SFNavigationTreeItem from '~/components/SFNavigationTreeItem.vue'
import { routeList } from '~/utils/route'
import SFBottomFooter from '~/components/SFBottomFooter.vue'

const currentShop = useCurrentShop()

const { data: headerTree } = useNavigationTreeByName(
  {
    params: { treeName: 'Simplified Header' },
  },
  'header-tree',
)

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
defineOptions({ name: 'AppSimple' })
</script>
