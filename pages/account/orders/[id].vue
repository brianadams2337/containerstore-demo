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
        <OrderItems
          :order-items="orderItems"
          :order-variants="orderVariants"
          :packages="packages"
        />
        <PaymentSummary
          :payment-key="paymentKey"
          :delivery-cost="deliveryCost"
          :total-amount="totalAmount"
        />
      </template>
    </div>
  </PageContent>
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import { definePageMeta } from '#imports'
import { useOrderDetails } from '~/composables/useOrderDetails'
import { useRoute } from '#app/composables/router'

const route = useRoute()
const paramId = computed(() => +route.params.id)

const {
  orderDetails,
  fetching,
  shippingAddress,
  billingAddress,
  itemCount,
  orderItems,
  orderVariants,
  packages,
  paymentKey,
  deliveryCost,
  totalAmount,
} = useOrderDetails(`order-${paramId.value}`)

defineOptions({ name: 'OrderDetailsView' })
definePageMeta({ pageType: 'account_area:order_id' })
</script>
