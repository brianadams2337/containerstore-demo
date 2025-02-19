<template>
  <div
    class="flex w-full flex-col border-gray-200 bg-gray-50 px-5 py-8 md:border-l lg:w-2/5 lg:items-start lg:pl-13 lg:pr-7"
  >
    <div class="text-sm">
      <SFHeadline size="xl" tag="h2">
        {{ $t('osp.order_number', { orderNumber: orderData.id }) }}
      </SFHeadline>
      <div>
        <SFOspDeliveryDate v-if="deliveryDate" :delivery-date="deliveryDate" />
        <div class="space-y-2">
          <ul v-if="orderItems.length">
            <li
              v-for="({ variant, product, price }, index) in orderItems"
              :key="index"
            >
              <SFOspProductCard
                v-if="product?.advancedAttributes && variant"
                :variant="variant"
                :product="product"
                :price="price"
                :quantity="getItemQuantity(variant.id)"
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
import type { Order, DeliveryDate, OrderItem } from '~/types/order'

const { orderData } = defineProps<{
  orderData: Order
  deliveryDate: DeliveryDate
}>()

const orderItems = computed((): OrderItem[] => {
  if (!orderData?.items) {
    return []
  }

  return orderData?.items.filter(
    (item, index, self) =>
      index ===
      self.findIndex((arrayItem) => arrayItem.variant.id === item.variant.id),
  ) as OrderItem[]
})

const getItemQuantity = (variantId: number): number | undefined => {
  const isVariant = (value: NonNullable<Order['items']>[number]) =>
    value.variant.id === variantId

  return orderData?.items?.filter(isVariant).length
}
</script>
