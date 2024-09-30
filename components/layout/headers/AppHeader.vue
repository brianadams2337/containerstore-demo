<template>
  <div id="header" class="bg-white" data-testid="main-header">
    <div class="border-b border-gray-200">
      <div
        class="mx-4 flex h-[4.375rem] items-center justify-between gap-1 md:container sm:gap-4"
      >
        <div class="flex-1">
          <SFButton
            class="md:hidden"
            type="raw"
            data-testid="side-navigation-button"
            @click="toggleSideNavigation"
          >
            <IconClose v-if="isSideNavigationOpen" class="size-6" />
            <IconBurger v-else class="size-6" />
          </SFButton>
        </div>
        <AppLogo class="ml-4 flex-initial" :width="138" :height="32" />
        <div class="flex flex-1 justify-end">
          <HeaderMainMenu v-if="!isCheckoutPage" />
        </div>
      </div>
    </div>
    <HeaderSubNavigation
      v-if="!isCheckoutPage"
      :navigation-tree="navigationTreeItems[0]"
      @mouseleave="closeFlyoutMenu"
    />
    <SFFlyoutMenu
      v-if="!isCheckoutPage"
      :is-open="isFlyoutMenuOpen"
      @mouseleave="closeFlyoutMenu"
    >
      <!--- THE ID's ARE IMPORTANT TO NOT CLOSE FLYOUT WHILE FAST MOVING MOUSE TO ITEMS -->
      <div id="flyout-menu-items-container" class="flex space-x-20">
        <CategoryFlyout />
        <NavigationFlyout />
      </div>
      <template #teaser>
        <slot name="flyout-teaser" />
      </template>
    </SFFlyoutMenu>
  </div>
</template>

<script setup lang="ts">
import CategoryFlyout from './CategoryFlyout.vue'
import NavigationFlyout from './NavigationFlyout.vue'
import { routeList } from '~/utils/route'
import { useLink } from '#vue-router'
import {
  useFlyouts,
  useNavigationTreeItems,
  useRouteHelpers,
  useSideNavigation,
} from '~/composables'
import AppLogo from '~/components/AppLogo.vue'
import HeaderMainMenu from '~/components/layout/headers/HeaderMainMenu.vue'
import HeaderSubNavigation from '~/components/layout/headers/HeaderSubNavigation.vue'
import { SFButton, SFFlyoutMenu } from '#storefront-ui/components'

const { isFlyoutMenuOpen, closeFlyoutMenu } = useFlyouts()

const { isSideNavigationOpen, toggleSideNavigation } = useSideNavigation()
const { getLocalizedRoute } = useRouteHelpers()

const { navigationTreeItems } = useNavigationTreeItems('header')

const { isExactActive: isCheckoutPage } = useLink({
  to: getLocalizedRoute(routeList.checkout.path),
})
</script>
