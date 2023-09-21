<template>
  <div
    class="flex min-h-screen flex-col text-primary antialiased anchor-scrolling-none">
    <AppHeader is-on-error-page />
    <div class="mt-4 grow">
      <ErrorLayout :error="error" @clear-error="resetErrorState()" />
    </div>
  </div>
</template>
<script setup lang="ts">

const error = useError()
const resetErrorState = async () => {
  const redirect = toLocalePath({ name: routeList.home.name }).toString()
  await clearError({ redirect })
}
</script>
<script lang="ts">
export default {
  name: 'AppFullscreenError',
}
</script>
