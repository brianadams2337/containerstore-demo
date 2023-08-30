<template>
  <div
    class="flex min-h-screen flex-col text-primary antialiased anchor-scrolling-none">
    <HeaderMetaBar />
    <AppHeader
      :fetching-categories="fetchingCategories"
      :root-categories="
        Array.isArray(rootCategories.categories)
          ? rootCategories.categories
          : [rootCategories.categories]
      "
      class="mb-4" />
    <ToastContainer />
    <slot />
  </div>
</template>

<script setup lang="ts">
const { data: rootCategories, pending: fetchingCategories } =
  await useCategories({ path: '/' }, { immediate: true })
</script>

<script lang="ts">
export default {
  name: 'AppDefault',
}
</script>
