<template>
  <div class="w-full md:container md:w-1/2 md:bg-gray-100 lg:w-2/5">
    <div class="py-4 text-sm md:container md:p-10 md:px-6 xl:px-20">
      <div class="divide-y divide-gray-500">
        <OspDeliveryDate v-if="deliveryDate" :delivery-date="deliveryDate" />
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
              <OspProductCard
                v-if="product?.advancedAttributes && variant"
                :variant="variant"
                :product="product"
                :price="price"
                :quantity="getItemQuantity(variant.id)"
              />
            </li>
          </ul>
        </div>
        <OspPaymentSummary :cost="orderData.cost" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import OspPaymentSummary from './OspPaymentSummary.vue'
import OspDeliveryDate from './OspDeliveryDate.vue'
import OspProductCard from './OspProductCard.vue'
import { SFHeadline } from '#storefront-ui/components'

type Props = {
  orderData: Order
  deliveryDate: DeliveryDate
}

const props = defineProps<Props>()

const orderItems = computed((): OrderItem[] => {
  if (!props.orderData?.items) {
    return []
  }

  return props.orderData?.items.filter(
    (item, index, self) =>
      index ===
      self.findIndex((arrayItem) => arrayItem.variant.id === item.variant.id),
  ) as OrderItem[]
})

const getItemQuantity = (variantId: number): number | undefined => {
  const isVariant = (value: NonNullable<Order['items']>[number]) =>
    value.variant.id === variantId

  return props.orderData?.items?.filter(isVariant).length
}
</script>
