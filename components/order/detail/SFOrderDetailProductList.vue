<template>
  <div class="flex flex-col gap-2.5">
    <div
      v-for="({ items }, packageId) in getOrderDeliveries(orderDetails)"
      :key="packageId"
      class="grid grid-cols-1"
    >
      <ul v-if="items.length" class="mb-3 flex flex-col gap-3 *:pt-3">
        <li
          v-for="{ variant, product, price, id, customData } in items"
          :key="id"
          class="pt-3"
        >
          <SFOrderDetailProductCard
            v-if="product?.advancedAttributes && variant"
            :variant="variant"
            :product="product"
            :price="price"
            :subscription="
              customData?.subscriptionDefinition as Record<string, string>
            "
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import SFOrderDetailProductCard from './SFOrderDetailProductCard.vue'
import type { Order } from '~/types/order'
import { getOrderDeliveries } from '~/utils'

const { orderDetails } = defineProps<{ orderDetails: Order }>()
</script>
