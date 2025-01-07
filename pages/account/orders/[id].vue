<template>
  <SFPageContainer class="p-0 md:mt-0">
    <div v-if="paramId">
      <SFOrderLoadingState v-if="status === 'pending'" />
      <template
        v-else-if="orderDetails && orderVariants && status === 'success'"
      >
        <template
          v-if="itemCount && orderDetails.shop?.id && orderDetails.confirmedAt"
        >
          <SFOrderHeader
            class="max-sm:hidden"
            :order-id="orderDetails.id"
            :shop-id="orderDetails.shop.id"
            :item-count="itemCount"
            :order-date="orderDetails.confirmedAt"
          />
        </template>
        <SFAddressSummary
          v-if="shippingAddress || billingAddress"
          :shipping-address="shippingAddress"
          :billing-address="billingAddress"
        />
        <SFOrderItems
          :order-items="orderItems"
          :order-variants="orderVariants"
          :packages="packages"
        />
        <SFPaymentSummary
          :payment-key="paymentKey"
          :delivery-cost="deliveryCost"
          :total-amount="totalAmount"
        />
      </template>
    </div>
  </SFPageContainer>
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import { definePageMeta } from '#imports'
import { useOrderDetails } from '~/composables/useOrderDetails'
import { useRoute } from '#app/composables/router'
import SFOrderLoadingState from '~/components/order/SFOrderLoadingState.vue'
import SFAddressSummary from '~/components/order/summary/SFAddressSummary.vue'
import SFOrderItems from '~/components/order/SFOrderItems.vue'
import SFOrderHeader from '~/components/order/SFOrderHeader.vue'
import SFPaymentSummary from '~/components/order/summary/SFPaymentSummary.vue'
import { SFPageContainer } from '#storefront-ui/components'

const route = useRoute()
const paramId = computed(() => +route.params.id)

const {
  orderDetails,
  status,
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
