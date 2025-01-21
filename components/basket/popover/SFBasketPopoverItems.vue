<template>
  <ul
    v-if="items?.length"
    class="max-h-xs overflow-y-auto overflow-x-hidden scrollbar-hide"
    :aria-label="$t('basket.available_products')"
  >
    <SFBasketPopoverCard
      v-for="item in availableItems"
      :key="item.key"
      :basket-item="item"
      class="w-80 sm:w-96"
    />
  </ul>
  <p v-else class="w-60 text-wrap p-3 text-center text-base text-gray-600">
    {{ $t('basket.no_items_info') }}
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SFBasketPopoverCard from './SFBasketPopoverCard.vue'
import { useBasket } from '#storefront/composables'

const { items } = useBasket()

const availableItems = computed(() =>
  (items.value ?? []).filter((item) => item.status === 'available'),
)
</script>
