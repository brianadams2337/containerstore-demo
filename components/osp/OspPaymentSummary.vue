<template>
  <div>
    <dl class="grid grid-cols-2 justify-between gap-2 py-6 text-gray-800">
      <dt>{{ $t('osp.net_price') }}:</dt>
      <dd class="text-right">
        {{ formatCurrency(cost.withoutTax) }}
      </dd>

      <dt>{{ $t('osp.tax') }}:</dt>
      <dd v-if="cost.tax.vat" class="text-right">
        {{ formatCurrency(cost.tax.vat.amount) }}
      </dd>

      <dt>{{ $t('osp.deliver_costs') }}:</dt>
      <dd class="text-right">{{ formatCurrency(0) }}</dd>
    </dl>

    <dl class="grid grid-cols-2 justify-between gap-0 py-6">
      <dt class="text-lg">{{ $t('osp.total') }}:</dt>
      <dd class="text-right text-xl font-bold">
        {{ formatCurrency(cost.withTax) }}
      </dd>
      <dt />
      <dt class="flex items-end justify-end text-sm text-gray-700">
        {{ $t('incl_tax') }}
      </dt>
    </dl>
  </div>
</template>

<script setup lang="ts">
defineProps({
  cost: {
    type: Object as PropType<Order['cost']>,
    required: true,
  },
})
const { formatCurrency } = useFormatHelpers()
</script>
