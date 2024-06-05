<template>
  <div
    class="flex min-h-screen flex-col text-primary antialiased anchor-scrolling-none"
  >
    <div class="border-b border-gray-200">
      <div
        class="mx-4 flex h-[4.375rem] items-center justify-center gap-1 md:container sm:gap-4"
      >
        <AppLogo class="ml-4 flex-initial" :width="138" :height="32" />
      </div>
    </div>
    <div class="mt-4 grow">
      <ErrorLayout :error="error" @clear-error="resetErrorState" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'
import { clearError , useError } from '#app/composables/error'
import { routeList } from '~/./utils/route'
import { useCurrentShop } from '#storefront/composables'
import { useLocalePath } from '#i18n'
const error = useError()
const localePath = useLocalePath()
const currentShop = useCurrentShop()

const resetErrorState = async () => {
  const redirect = localePath(routeList.home).toString()
  if (currentShop.value) {
    await clearError({ redirect })
  }

  window.location.href = redirect
}

defineOptions({ name: 'GlobalError' })
</script>
