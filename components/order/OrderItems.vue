<template>
  <div id="itemPackages">
    <div
      v-for="(map, carrierId, idx) in carrierBundledItemsMap"
      :key="`delivery-block-carrier-${carrierId}`"
      class="rounded-t-md border border-gray-350 border-b-transparent bg-white md:mb-4 md:rounded-md md:border-b-gray-350"
    >
      <div v-if="orderVariants" id="imageHeader">
        <OrderStatusBar
          v-bind="map.deliveryInfo"
          :index="idx"
          class="p-5 md:border-b md:border-b-gray-350"
        />
        <div
          v-for="{ key, ...data } in map.items"
          :key="key"
          class="flex space-x-4 p-5 pb-0 last-of-type:pb-5"
        >
          <OrderItemCard
            v-bind="data"
            data-test-id="order-item-card"
            :delivery-status="map.deliveryInfo.formattedStatus"
            :quantity="getItemQuantity(data.variant.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { unique } from 'radash'
import { useOrders } from '~/composables'

type CarrierMap = Record<
  string,
  { items: OrderItems; deliveryInfo: DeliveryInfo }
>

const { orderVariants, orderItems, packages } = await useOrders()

const uniqueItems = computed(() => {
  return unique(orderItems.value, (it) => it.variant.id)
})

const carrierBundledItemsMap = computed<CarrierMap | undefined>(() => {
  // every item has a packageId
  // every carrier has a package id
  return packages.value?.reduce((carrierMap: CarrierMap, pkg: Package) => {
    const items = uniqueItems.value?.filter(
      (it: OrderItem) => it.packageId === pkg.id,
    )
    const formattedStatus = pkg.deliveryStatus?.split('_').join(' ') || ''
    const deliveryInfo = { ...pkg, formattedStatus }
    carrierMap[pkg.id] = { items: items ?? [], deliveryInfo }
    return carrierMap
  }, {})
})

const getItemQuantity = (variantId: number | unknown): number | undefined => {
  return orderItems?.value.filter((it) => it.variant.id === variantId).length
}
</script>
