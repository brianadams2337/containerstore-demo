<template>
  <div id="header" class="bg-white" data-test-id="main-header">
    <div class="border-b border-gray-200">
      <div
        class="mx-4 flex h-[4.375rem] items-center justify-between gap-1 md:container sm:gap-4"
      >
        <div class="flex-1">
          <AppButton
            class="md:hidden"
            type="ghost"
            data-test-id="side-navigation-button"
            @click="toggleSideNavigation"
          >
            <IconClose v-if="isSideNavigationOpen" class="size-6" />
            <IconBurger v-else class="size-6" />
          </AppButton>
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
    <FlyoutMenu
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
    </FlyoutMenu>
  </div>
</template>

<script setup lang="ts">
const { isFlyoutMenuOpen, closeFlyoutMenu } = useFlyouts()

const { isSideNavigationOpen, toggleSideNavigation } = useSideNavigation()

const { navigationTreeItems } = await useNavigationTreeItems('header')

// TODO: Check if this really works when we start touching checkout related stuff
const { isExactActive: isCheckoutPage } = useLink({
  to: routeList.checkout.path,
})
</script>
