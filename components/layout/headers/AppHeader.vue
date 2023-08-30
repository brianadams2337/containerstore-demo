<template>
  <div
    id="header"
    class="sticky top-0 z-50 bg-white"
    data-test-id="main-header">
    <div class="border-b border-gray-200">
      <div
        class="container flex h-[4.375rem] items-center justify-between gap-1 sm:gap-4">
        <div class="flex-1">
          <AppButton
            class="md:hidden"
            type="ghost"
            data-test-id="side-navigation-button"
            @click="toggleSideNavigation">
            <SvgoUiClose v-if="isSideNavigationOpen" class="h-6 w-6" />
            <SvgoUiBurger v-else class="h-6 w-6" />
          </AppButton>
        </div>
        <Logo class="ml-4 flex-initial" :width="138" :height="32" />
        <div class="flex flex-1 justify-end">
          <!-- <HeaderMainMenu v-if="!isCheckoutPage" /> -->
        </div>
      </div>
    </div>
    <HeaderSubNavigation
      v-if="!isCheckoutPage"
      v-bind="{ rootCategories, fetchingCategories }"
      :navigation-tree="navigationTrees[0]"
      @mouseenter:item="openFlyoutMenu"
      @mouseleave="closeFlyoutMenu"
      @mouseenter:navigation-item="openFlyoutMenuForNavigationTree" />
    <FlyoutMenu
      v-if="!isCheckoutPage"
      :is-open="isFlyoutMenuOpen"
      @mouseleave="closeFlyoutMenu">
      <!--- THE ID's ARE IMPORTANT TO NOT CLOSE FLYOUT WHILE FAST MOVING MOUSE TO ITEMS -->
      <div id="flyout-menu-items-container" class="flex space-x-20">
        <CategoryFlyout />
        <NavigationFlyout />
      </div>
      <template #teaser>
        <slot name="flyout-teaser" />
      </template>
    </FlyoutMenu>
  </div>
</template>

<script setup lang="ts">
import { Category, NavigationTree } from '@scayle/storefront-nuxt'

defineProps({
  rootCategories: {
    type: [Array, Object] as PropType<Category[] | Category>,
    default: () => [],
  },
  fetchingCategories: {
    type: Boolean,
    default: () => false,
  },
  navigationTrees: {
    type: Array as PropType<NavigationTree[]>,
    default: () => [],
  },
})

const {
  isFlyoutMenuOpen,
  closeFlyoutMenu,
  isSideNavigationOpen,
  openFlyoutMenu,
  toggleSideNavigation,
  openFlyoutMenuForNavigationTree,
} = useUiState()

// TODO: Check if this really works when we start touching checkout related stuff
const { isExactActive: isCheckoutPage } = useLink({
  to: route.routes.checkout.path,
})
</script>
