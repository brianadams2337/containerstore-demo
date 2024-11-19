<template>
  <div class="flex flex-col space-y-2 border-t border-gray-200 p-4">
    <SFButton variant="primary" :to="checkoutOrHomeRoute" class="w-full">
      {{ $t('basket.checkout_label') }}
    </SFButton>
    <SFButton
      variant="secondary"
      :to="getLocalizedRoute(routeList.basket)"
      class="w-full"
    >
      {{ $t('basket.heading') }}
    </SFButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { routeList } from '~/utils/route'
import { useUser } from '#storefront/composables'
import { SFButton } from '#storefront-ui/components'
import { useRouteHelpers } from '~/composables'

const { isLoggedIn } = useUser()

const { getLocalizedRoute } = useRouteHelpers()

const checkoutOrHomeRoute = computed(() => {
  const route = isLoggedIn.value ? routeList.checkout : routeList.signin
  return getLocalizedRoute(route)
})
</script>
