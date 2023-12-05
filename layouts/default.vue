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
      <ErrorLayout
        v-if="hasError"
        :error="error"
        @clear-error="resetErrorState"
      />
      <NuxtPage v-else />
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

// Error handling
const error = ref()
const hasError = computed(() => Boolean(error.value))
const nuxtApp = useNuxtApp()

onErrorCaptured((err, target, info) => {
  nuxtApp.hooks.callHook('vue:error', err, target, info)
  error.value = err
  return false
})

const router = useRouter()
router.afterEach(async () => {
  if (error.value) {
    error.value = undefined
    await clearError()
  }
})

const resetErrorState = async () => {
  const redirect = toLocalePath(routeList.home).toString()
  await clearError({ redirect })
  error.value = undefined
}

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
