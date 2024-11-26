<template>
  <header
    class="flex h-13 items-center space-x-4 border-gray-200 px-4 lg:h-16 lg:space-x-7 lg:border-b lg:px-7"
  >
    <SFButton
      variant="raw"
      class="shrink-0 lg:hidden"
      data-testid="side-navigation-button"
      @click="isSideNavigationOpen = !isSideNavigationOpen"
    >
      <IconClose v-if="isSideNavigationOpen" class="size-7" />
      <IconBurger v-else class="size-7" />
    </SFButton>

    <SFSlideInFromLeftTransition>
      <MobileSidebar
        v-popover="isSideNavigationOpen"
        class="absolute top-13 !m-0 h-[calc(100dvh-52px)] w-screen bg-white !p-0"
        :class="{
          'block-scrolling': isSideNavigationOpen,
          hidden: !isSideNavigationOpen,
        }"
        :is-open="isSideNavigationOpen"
        :navigation-items="mainNavigationItems"
        @close="isSideNavigationOpen = false"
      />
    </SFSlideInFromLeftTransition>

    <LocalizedLink :to="routeList.home" :aria-label="shopName" class="lg:!ml-0">
      <IconNewLogo class="size-7" aria-hidden="true" />
    </LocalizedLink>

    <nav class="h-full grow max-lg:hidden" data-testid="nav-categories">
      <ul class="flex h-full grow-[2]">
        <HeaderNavigationItem
          v-for="item in mainNavigationItems"
          :key="item.id"
          class="pl-2 first:pl-0"
          :item="item"
        />
      </ul>
    </nav>
    <SearchInput class="shrink grow max-lg:hidden" />
    <div class="flex items-center space-x-4 max-lg:grow max-lg:justify-end">
      <UserNavigationItem :block-popup="isSideNavigationOpen" />
      <WishlistNavigationItem />
      <BasketNavigationItem :block-popup="isSideNavigationOpen" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { whenever } from '@vueuse/core'
import UserNavigationItem from './UserNavigationItem.vue'
import BasketNavigationItem from './BasketNavigationItem.vue'
import WishlistNavigationItem from './WishlistNavigationItem.vue'
import SearchInput from './search/SearchInput.vue'
import MobileSidebar from './MobileSidebar.vue'
import HeaderNavigationItem from './HeaderNavigationItem.vue'
import { vPopover } from '~/modules/ui/runtime/directives/popover'
import { useNuxtApp } from '#app/nuxt'
import { routeList } from '~/utils'
import LocalizedLink from '~/components/LocalizedLink.vue'
import {
  SFButton,
  SFSlideInFromLeftTransition,
} from '~/modules/ui/runtime/components'
import { useNavigationTreeByName } from '#storefront/composables'
import { useDefaultBreakpoints } from '~/modules/ui/runtime'

const {
  $config: {
    public: { shopName },
  },
} = useNuxtApp()

const isSideNavigationOpen = ref(false)

const { greaterOrEqual } = useDefaultBreakpoints()
const isDesktopLayout = greaterOrEqual('lg')
whenever(isDesktopLayout, () => {
  isSideNavigationOpen.value = false
})

const { data: navigationTree } = useNavigationTreeByName({
  params: { treeName: 'Header', params: { with: { category: true } } },
})

const mainNavigationItems = computed(() => {
  return navigationTree.value?.items
})
</script>
