<template>
  <div
    id="paymentHeader"
    class="rounded-t-none border border-gray-350 bg-white md:rounded-md"
  >
    <div class="px-5 pt-5 text-xs">
      <div
        class="flex flex-col border-b border-gray-350 font-semibold text-primary"
      >
        <div class="mb-3 flex flex-row justify-between">
          <p class="text-secondary">
            {{ $t('my_account.orders.order_value') }}
          </p>
          <p>{{ formatCurrency(totalAmount) }}</p>
        </div>
        <div class="mb-4 flex flex-row justify-between">
          <p class="text-secondary">{{ $t('my_account.orders.shipping') }}</p>
          <p v-if="deliveryCost > 0">{{ formatCurrency(deliveryCost) }}</p>
          <p v-else class="text-green-neon">{{ $t('basket.shipping_free') }}</p>
        </div>
      </div>
    </div>
    <div class="p-5">
      <div class="flex flex-row justify-between">
        <p class="text-sm font-semibold">
          {{ $t('my_account.orders.residual_value') }}
        </p>
        <div class="flex flex-col">
          <p class="text-xl font-bold">{{ formatCurrency(totalAmount) }}</p>
          <p class="text-right text-[10px] font-medium text-secondary">
            {{ $t('incl_tax') }}
          </p>
        </div>
      </div>
    </div>
    <div
      v-if="paymentKey"
      class="border-t border-t-gray-350 bg-secondary-450 px-5 py-7"
    >
      <p class="text-xs font-semibold text-secondary">
        {{ $t('my_account.orders.paid_with') }}:
        <PaymentIcon
          :paid-with="paymentKey"
          class="text-sm font-bold text-primary"
        />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrders } from '~/composables'
import { useFormatHelpers } from '#storefront/composables'

const { formatCurrency } = useFormatHelpers()

const { totalAmount, deliveryCost, paymentKey } = useOrders(
  'payment-summary.vue',
)
</script>
