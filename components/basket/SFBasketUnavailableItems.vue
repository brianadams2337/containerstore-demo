<template>
  <ul
    class="flex w-full -translate-y-6 flex-col items-end pt-px lg:min-w-125 lg:max-w-156"
    :aria-label="$t('basket.unavailable_products')"
  >
    <SFBasketCard
      v-for="item in unavailableItems"
      :key="item.key"
      :basket-item="item"
      class="-mt-px w-full focus-within:z-10 lg:first:!rounded-t-none lg:first:!border-t-0"
      @delete="$emit('delete', item)"
    />
  </ul>
</template>

<script setup lang="ts">
import type { BasketItem } from '@scayle/storefront-nuxt'
import SFBasketCard from './SFBasketCard.vue'

const { unavailableItems = [] } = defineProps<{
  unavailableItems?: BasketItem[]
}>()

defineEmits<{ (e: 'delete', item: BasketItem): void }>()
</script>
