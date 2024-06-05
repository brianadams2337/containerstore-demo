<template>
  <PageContent class="p-0 md:mt-0">
    <div v-if="paramId">
      <OrderLoadingState v-if="fetching" />
      <template v-else-if="orderDetails && !fetching">
        <template
          v-if="itemCount && orderDetails.shop?.id && orderDetails.confirmedAt"
        >
          <OrderHeader
            class="max-sm:hidden"
            :order-id="orderDetails.id"
            :shop-id="orderDetails.shop.id"
            :item-count="itemCount"
            :order-date="orderDetails.confirmedAt"
          />
        </template>
        <AddressSummary
          v-if="shippingAddress || billingAddress"
          v-bind="{ shippingAddress, billingAddress }"
        />
        <OrderItems />
        <PaymentSummary />
      </template>
    </div>
  </PageContent>
</template>

<script setup lang="ts">
import { defineOptions , computed } from 'vue'
import { useOrders } from '~/composables/useOrders'
import { useRoute } from '#app/composables/router'
const route = useRoute()
const paramId = computed(() => +route.params.id)

const { orderDetails, fetching, shippingAddress, billingAddress, itemCount } =
  await useOrders()

defineOptions({ name: 'OrderDetailsView' })
definePageMeta({ pageType: 'account_area:order_id' })
</script>
