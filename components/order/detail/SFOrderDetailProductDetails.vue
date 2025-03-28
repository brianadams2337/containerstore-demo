<template>
  <div class="flex flex-col text-gray-900">
    <span
      v-if="brand"
      class="text-base font-semi-bold-variable"
      data-testid="order-detail-product-brand"
    >
      {{ brand }}
    </span>
    <span class="text-sm" data-testid="order-detail-product-name">
      {{ name }}
    </span>
  </div>
  <ul class="flex flex-col gap-1 text-sm text-gray-600">
    <li v-if="color" class="flex gap-1">
      <span class="font-medium" data-testid="order-detail-product-color">
        {{ $t('my_account.orders.detail.color') }}:
      </span>
      <span>{{ color }}</span>
    </li>
    <li class="flex gap-1">
      <span class="font-medium" data-testid="order-detail-product-size">
        {{ $t('my_account.orders.detail.size') }}:
      </span>
      <span>{{ size }}</span>
    </li>
    <li class="flex gap-1">
      <span class="font-medium" data-testid="order-detail-product-quantity">
        {{ $t('my_account.orders.detail.quantity_label') }}:
      </span>
      <span>{{ quantity }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
const { name, color, brand, size } = defineProps<{
  name: string
  quantity: number
  size: string
  brand?: string
  color?: string
}>()
</script>
