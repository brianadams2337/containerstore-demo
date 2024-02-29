<template>
  <div
    class="flex min-h-screen flex-col text-primary antialiased anchor-scrolling-none"
  >
    <PromotionBanner
      v-if="promotionData.entities.length"
      :promotions="promotionData.entities"
    />
    <HeaderMetaBar />
    <AppHeader />
    <ToastContainer />
    <MobileSidebar />
    <div class="mt-4 grow">
      <NuxtPage />
    </div>
    <AppFooter class="mt-16" />
  </div>
</template>

<script setup lang="ts">
const { data: promotionData } = await useCurrentPromotions()

const { trackShopInit, listenToUserItemsChanges, listenToCustomerDataChanges } =
  useTrackingEvents()

trackShopInit()
await listenToUserItemsChanges()
await listenToCustomerDataChanges()

// Meta tags
const { isSideNavigationOpen } = useSideNavigation()
const { isOpen: isModalOpen } = useModal()

useHead({
  bodyAttrs: () => ({
    class: [
      'relative',
      isSideNavigationOpen.value || isModalOpen.value
        ? 'overflow-hidden h-full'
        : '',
    ],
  }),
})

defineOptions({ name: 'AppDefault' })
</script>
