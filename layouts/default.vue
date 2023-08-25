<template>
  <div
    class="flex min-h-screen flex-col text-primary antialiased anchor-scrolling-none">
    <AppHeader class="mb-4" />
    <ToastContainer />
    <slot />
  </div>
</template>

<script lang="ts">
export default {
  name: 'AppDefault',
}
</script>
