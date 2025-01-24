<template>
  <div class="text-base leading-none lg:text-sm">
    <div class="flex space-x-1">
      <span
        class="font-semi-bold-variable text-gray-600"
        data-testid="main-label"
      >
        {{ $t('basket_card.size_label') }}:
      </span>
      <span class="font-normal text-gray-600" data-testid="sub-label">
        {{ size }}
      </span>
    </div>
    <div class="mt-1 flex space-x-1">
      <span
        class="font-semi-bold-variable text-gray-600"
        data-testid="main-label"
      >
        {{ $t('basket_card.color_label') }}:
      </span>
      <span class="font-normal text-gray-600" data-testid="sub-label">
        {{ color }}
      </span>
    </div>
    <div v-if="isQuantityShown" class="mt-1 flex space-x-1">
      <span
        class="font-semi-bold-variable text-gray-600"
        data-testid="main-label"
      >
        {{ $t('basket_card.quantity_label') }}:
      </span>
      <span class="font-normal text-gray-600" data-testid="sub-label">
        {{ item.quantity }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  type BasketItem,
  getAttributeValueTuples,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'

const { item, isQuantityShown = false } = defineProps<{
  item: BasketItem
  isQuantityShown?: boolean
}>()

const size = getFirstAttributeValue(item.variant.attributes, 'size')?.label
const color = getAttributeValueTuples(item.product.attributes, 'color')
  .map((color) => color.label)
  .join('/')
</script>
