<template>
  <ul
    class="flex w-full flex-col items-end pt-px lg:min-w-125 lg:max-w-156"
    :aria-label="$t('basket.available_products')"
  >
    <SFBasketCard
      v-for="item in availableItems"
      :key="item.key"
      :basket-item="item"
      class="-mt-px w-full focus-within:z-10"
      @update:quantity="$emit('update:quantity', item, $event)"
      @delete="$emit('delete', item)"
    />
  </ul>
</template>

<script setup lang="ts">
import type { BasketItem } from '@scayle/storefront-nuxt'
import SFBasketCard from './SFBasketCard.vue'

const { availableItems = [] } = defineProps<{ availableItems?: BasketItem[] }>()

defineEmits<{
  delete: [item: BasketItem]
  'update:quantity': [item: BasketItem, newQuantity: number]
}>()
</script>
