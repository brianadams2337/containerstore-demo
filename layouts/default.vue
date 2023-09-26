<template>
  <div
    class="flex min-h-screen flex-col text-primary antialiased anchor-scrolling-none">
    <HeaderMetaBar />
    <AppHeader v-bind="{ rootCategories, fetchingCategories }" />
    <ToastContainer />
    <MobileSidebar
      v-if="viewport.isLessThan('md')"
      v-bind="{ rootCategories, fetchingCategories }" />
    <div class="mt-4 grow">
      <ErrorLayout
        v-if="hasError"
        :error="error"
        @clear-error="resetErrorState" />
      <slot v-else />
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
})

const { data: rootCategoriesData, fetching: fetchingCategories } = categoryData

const { trackShopInit, listenToUserItemsChanges, listenToCustomerDataChanges } =
  useTrackingEvents()

const viewport = useViewport()

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
  const redirect = toLocalePath({ name: routeList.home.name }).toString()
  await clearError({ redirect })
  error.value = undefined
}

trackShopInit()
await listenToUserItemsChanges()
await listenToCustomerDataChanges()

// meta tags
const { isSideNavigationOpen, isModalOpen } = useUiState()
useHead({
  bodyAttrs: () => ({
    class:
      isSideNavigationOpen.value || isModalOpen.value
        ? 'overflow-hidden h-full'
        : '',
  }),
})
</script>

<script lang="ts">
export default {
  name: 'AppDefault',
}
</script>
