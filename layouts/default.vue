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
      <template v-if="hasError">
        <ErrorLayout :error="error" @clear-error="resetErrorState" />
      </template>
      <template v-else>
        <slot />
      </template>
    </div>
    <AppFooter class="mt-16" />
  </div>
</template>

<script setup lang="ts">
const {
  data: rootCategoriesData,
  fetching: fetchingCategories,
  error: categoriesError,
} = await useCategories({ path: '/' }, { autoFetch: true })

const { error: wishlistError } = await useWishlist(undefined, {
  autoFetch: true,
})
const { error: basketError } = await useBasket(undefined, { autoFetch: true })

const viewport = useViewport()

const rootCategories = computed(() => {
  return Array.isArray(rootCategoriesData.value.categories)
    ? rootCategoriesData.value.categories
    : [rootCategoriesData.value.categories]
})

const error = useState('app:error')
const hasError = computed(() => Boolean(error.value))
const nuxtApp = useNuxtApp()

onErrorCaptured((err, target, info) => {
  nuxtApp.hooks.callHook('vue:error', err, target, info)
  error.value = createError(err)
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

if (categoriesError.value || wishlistError.value || basketError.value) {
  error.value = createError(
    categoriesError.value || wishlistError.value || basketError.value,
  )
}
</script>

<script lang="ts">
export default {
  name: 'AppDefault',
}
</script>
