<template>
  <div class="w-full md:container md:w-1/2 md:bg-gray-100 lg:w-2/5">
    <div class="py-4 text-sm md:container md:p-10 md:px-6 xl:px-20">
      <div class="divide-y divide-gray-500">
        <SFOspDeliveryDate v-if="deliveryDate" :delivery-date="deliveryDate" />
        <div class="space-y-2">
          <SFHeadline
            size="sm"
            tag="h2"
            is-uppercase
            class="mb-3 mt-8 block sm:hidden"
          >
            {{ $t('osp.order_overview') }}
          </SFHeadline>

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
        <SFOspPaymentSummary :cost="orderData.cost" />
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
