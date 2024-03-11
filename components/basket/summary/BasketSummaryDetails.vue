<template>
  <div
    class="flex flex-col justify-between gap-2 text-sm font-bold text-gray-800"
  >
    <div class="flex justify-between">
      <div class="opacity-50">{{ $t('basket.subtotal') }}</div>
      <div v-if="totalCost">{{ formatCurrency(totalCost) }}</div>
    </div>

    <div class="flex justify-between">
      <div class="opacity-50">{{ $t('basket.shipping') }}</div>
      <div>{{ $t('basket.shipping_free') }}</div>
    </div>

    <div class="flex justify-between">
      <div class="opacity-50">{{ $t('basket.discount') }}</div>
      <div v-if="totalDiscount" class="text-red-500">
        {{ formatCurrency(totalDiscount) }}
      </div>
    </div>

    <hr class="col-span-full my-4 border border-gray-350" />

    <div class="flex justify-between">
      <div class="opacity-50">
        {{ $t('basket.total') }}
      </div>
      <div class="">
        <div v-if="totalCost" class="text-xl">
          {{ formatCurrency(totalCost) }}
        </div>
        <div class="text-2xs opacity-50">
          {{ $t('basket.including_vat') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const basket = await useBasket()

const { formatCurrency } = useFormatHelpers()

const totalCost = computed(() => basket.data.value?.cost.withTax)

const totalDiscount = computed(() => {
  const discounts = (basket.data.value?.cost.appliedReductions ?? []).map(
    ({ amount }) => amount.absoluteWithTax,
  )
  return _sum(discounts)
})
</script>
