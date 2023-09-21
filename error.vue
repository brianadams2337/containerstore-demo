<template>
  <div
    class="flex min-h-screen flex-col text-primary antialiased anchor-scrolling-none">
    <div class="border-b border-gray-200">
      <div
        class="mx-4 flex h-[4.375rem] items-center justify-center gap-1 md:container sm:gap-4">
        
        <Logo class="ml-4 flex-initial" :width="138" :height="32" />
        
      </div>
    </div>
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
  name: 'GlobalError',
}
</script>
