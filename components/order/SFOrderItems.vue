<template>
  <div id="itemPackages">
    <div
      v-for="(map, carrierId, idx) in carrierBundledItemsMap"
      :key="`delivery-block-carrier-${carrierId}`"
      class="rounded-t-md border border-gray-350 border-b-transparent bg-white md:mb-4 md:rounded-md md:border-b-gray-350"
      data-testid="order-items"
    >
      <div v-if="orderVariants" id="imageHeader">
        <SFOrderStatusBar
          v-bind="map.deliveryInfo"
          :index="idx"
          class="p-5 md:border-b md:border-b-gray-350"
          data-testid="order-status-bar"
        />
        <div
          v-for="{ key, ...data } in map.items"
          :key="key"
          class="flex space-x-4 p-5 pb-0 last-of-type:pb-5"
        >
          <SFOrderItemCard
            v-bind="data"
            data-testid="order-item-card"
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
import type { VariantDetail } from '@scayle/storefront-api'
import type { ListOfPackages } from '@scayle/storefront-nuxt'
import SFOrderStatusBar from './SFOrderStatusBar.vue'
import SFOrderItemCard from './SFOrderItemCard.vue'
import type {
  OrderItems,
  DeliveryInfo,
  Package,
  OrderItem,
} from '~/types/order'

const props = defineProps<{
  orderVariants: VariantDetail[]
  orderItems: OrderItems
  packages?: ListOfPackages
}>()

type CarrierMap = Record<
  string,
  { items: OrderItems; deliveryInfo: DeliveryInfo }
>

const uniqueItems = computed(() => {
  return props.orderItems.filter(
    (item, index, self) =>
      index ===
      self.findIndex((arrayItem) => arrayItem.variant.id === item.variant.id),
  )
})

const carrierBundledItemsMap = computed<CarrierMap | undefined>(() => {
  // every item has a packageId
  // every carrier has a package id
  return props.packages?.reduce((carrierMap: CarrierMap, pkg: Package) => {
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
  return props.orderItems?.filter((it) => it.variant.id === variantId).length
}
</script>
