<template>
  <div
    class="flex w-full flex-col border-gray-200 bg-gray-50 px-5 py-8 md:border-l lg:w-2/5 lg:items-start lg:pl-13 lg:pr-7"
  >
    <div class="text-sm">
      <SFHeadline size="xl" tag="h2" class="mb-4">
        {{ $t('osp.order_number', { orderNumber: orderData.id }) }}
      </SFHeadline>
      <div>
        <div
          v-for="({ items, shipment }, packageId) in deliveries"
          :key="packageId"
          class="grid grid-cols-1 md:grid-cols-[minmax(auto,400px)]"
        >
          <SFOspDeliveryDate
            v-if="shipment.deliveryDate"
            :delivery-date="shipment.deliveryDate"
            :sender="shipment.carrierKey"
          />
          <ul
            v-if="items.length"
            class="mb-3 flex flex-col gap-3 divide-y *:pt-3"
          >
            <li
              v-for="{ variant, product, price, id, customData } in items"
              :key="id"
              class="pt-3"
            >
              <SFOspProductCard
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

        <!-- eslint-disable-next-line tailwindcss/no-custom-classname -->
        <div class="grid grid-cols-1 md:grid-cols-[minmax(auto,400px)]">
          <SFOspPaymentSummary :cost="orderData.cost" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SFOspPaymentSummary from './SFOspPaymentSummary.vue'
import SFOspDeliveryDate from './SFOspDeliveryDate.vue'
import SFOspProductCard from './SFOspProductCard.vue'
import { SFHeadline } from '#storefront-ui/components'
import type { Order, OrderItem, Package } from '~/types/order'

const { orderData } = defineProps<{
  orderData: Order
}>()

const deliveries = computed(() => {
  return (orderData?.items ?? []).reduce<
    Record<number, { items: OrderItem[]; shipment: Package }>
  >((group, item: OrderItem) => {
    const key = item.packageId
    const shipment = orderData.packages?.find(({ id }) => id === key)
    if (!shipment) {
      return group
    }
    group[key] ??= { items: [], shipment }
    group[key].items.push(item)
    return group
  }, {})
})
</script>
