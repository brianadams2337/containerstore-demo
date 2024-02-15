<template>
  <div
    class="flex min-h-screen flex-col text-primary antialiased anchor-scrolling-none"
  >
    <PromotionBanner
      v-if="promotionData.entities.length"
      :promotions="promotionData.entities"
    />
    <HeaderMetaBar />
    <AppHeader v-bind="{ rootCategories, fetchingCategories }" />
    <ToastContainer />
    <MobileSidebar v-bind="{ rootCategories, fetchingCategories }" />
    <div class="mt-4 grow">
      <NuxtPage />
    </div>
    <AppFooter class="mt-16" />
  </div>
</template>

<script setup lang="ts">
// Initialize data
await useWishlist()
await useBasket()
const categoryData = await useCategories({
  params: { path: '/' },
  key: 'categoryNavigation',
})

const { data: promotionData } = await useCurrentPromotions()

const { data: rootCategoriesData, fetching: fetchingCategories } = categoryData

const { trackShopInit, listenToUserItemsChanges, listenToCustomerDataChanges } =
  useTrackingEvents()

const rootCategories = computed(() => {
  return Array.isArray(rootCategoriesData.value.categories)
    ? rootCategoriesData.value.categories
    : [rootCategoriesData.value.categories]
})

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
