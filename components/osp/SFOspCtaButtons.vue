<template>
  <div class="flex gap-4">
    <SFButton
      variant="tertiary"
      :to="getLocalizedRoute(routeList.home)"
      class="flex-1"
    >
      {{ $t('global.continue_shopping_label') }}
    </SFButton>
    <SFButton
      v-if="orderData.id"
      variant="primary"
      class="flex-1"
      :to="getOrderDetailsRoute(orderData.id)"
    >
      {{ $t('osp.order_details') }}
    </SFButton>
  </div>
</template>
<script lang="ts" setup>
import type { Order } from '~/types/order'
import { useRouteHelpers } from '~/composables/useRouteHelpers'
import { SFButton } from '#storefront-ui/components'
import { routeList } from '~/utils/route'

defineProps<{
  orderData: Order
}>()

const { getOrderDetailsRoute, getLocalizedRoute } = useRouteHelpers()
</script>
