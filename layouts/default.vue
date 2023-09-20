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
      <slot />
    </div>
    <AppFooter class="mt-16" />
  </div>
</template>

<script setup lang="ts">
import withParams from '~/constants/withParams'

const { data: rootCategoriesData, fetching: fetchingCategories, error: categoriesError } =
  await useCategories({ path: '/' }, { autoFetch: true })

const { error: wishlistErrror}  = await useWishlist(withParams.wishlist, { autoFetch: true })
const {error: basketError } = await useBasket(withParams.basket, { autoFetch: true })

const viewport = useViewport()

const rootCategories = computed(() => {
  return Array.isArray(rootCategoriesData.value.categories)
    ? rootCategoriesData.value.categories
    : [rootCategoriesData.value.categories]
})

watch([categoriesError, wishlistErrror, basketError], (newErrors) => {
  const firstError = newErrors.find((e) => e)
  showError(handleError(firstError))
})
</script>

<script lang="ts">
export default {
  name: 'AppDefault',
}
</script>
