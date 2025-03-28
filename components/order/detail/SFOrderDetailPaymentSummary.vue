<template>
  <div class="flex flex-col gap-4 border-t pt-4">
    <dl class="grid grid-cols-2 justify-between gap-2 text-base text-gray-900">
      <dt class="font-semi-bold-variable">
        {{ $t('my_account.orders.detail.subtotal') }}
      </dt>
      <dd
        class="text-right font-semi-bold-variable"
        data-testid="order-detail-subtotal"
      >
        {{ formatCurrency(subtotal) }}
      </dd>

      <dt>{{ $t('my_account.orders.detail.shipping_costs') }}</dt>
      <dd class="text-right" data-testid="order-detail-shipping-cost">
        {{ formatCurrency(shippingCost) }}
      </dd>
    </dl>

    <dl
      class="grid grid-cols-2 justify-between gap-0 text-lg font-semi-bold-variable"
    >
      <dt class="text-lg">{{ $t('my_account.orders.detail.total') }}</dt>
      <dd class="text-right text-xl" data-testid="order-detail-total">
        {{ formatCurrency(cost.withTax) }}
      </dd>
      <dt class="text-xs text-gray-500">
        {{ includesTax ? $t('incl_tax') : $t('excl_tax') }}
      </dt>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormatHelpers } from '#storefront/composables'
import type { Order } from '~/types/order'
import { getShippingCost } from '~/utils/price'

const { cost } = defineProps<{ cost: Order['cost'] }>()

const { formatCurrency } = useFormatHelpers()

const shippingCost = computed(() => {
  return getShippingCost(cost.appliedFees, { includeTax: true })
})

const subtotal = computed(() => cost.withTax - shippingCost.value)

const includesTax = computed(() => !!cost.tax.vat?.amount)
</script>
