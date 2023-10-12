<template>
  <div
    class="flex min-h-screen flex-col text-primary antialiased anchor-scrolling-none">
    <HeaderMetaBar />
    <AppHeader v-bind="{ rootCategories, fetchingCategories }" />
    <ToastContainer />
    <MobileSidebar v-bind="{ rootCategories, fetchingCategories }" />
    <div class="mt-4 grow">
      <ErrorLayout
        v-if="hasError"
        :error="error"
        @clear-error="resetErrorState" />
      <slot v-else />
    </div>
    <NuxtLazyHydrate placeholder-ratio="16/9" when-visible>
      <AppFooter class="mt-16" />
    </NuxtLazyHydrate>
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
  const redirect = toLocalePath({ name: routeList.home.name }).toString()
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
