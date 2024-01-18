<template>
  <div class="w-full md:container md:w-1/2 md:bg-gray-100 lg:w-2/5">
    <div class="py-4 text-sm md:container md:p-10 md:px-6 xl:px-20">
      <div class="divide-y divide-gray-500">
        <OspDeliveryDate v-if="deliveryDate" v-bind="{ deliveryDate }" />
        <div class="space-y-2">
          <Headline
            size="sm"
            tag="h2"
            is-uppercase
            class="mb-3 mt-8 block sm:hidden"
          >
            {{ $t('osp.order_overview') }}
          </Headline>

          <ul v-if="orderItems">
            <li
              v-for="({ variant, product, price }, idx) in orderItems"
              :key="idx"
            >
              <OspProductCard
                v-if="product.advancedAttributes"
                v-bind="{ variant, product, price }"
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
type Props = {
  orderData: Order
  deliveryDate: DeliveryDate
}

const props = defineProps<Props>()

const orderItems = computed(() => {
  return useUnique(props.orderData?.items || [], (it) => it.variant.id)
})

const getItemQuantity = (variantId: number): number | undefined => {
  const isVariant = (value: any) => value.variant.id === variantId
  return props.orderData?.items?.filter(isVariant).length
}
</script>
