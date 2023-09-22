<template>
  <div id="itemPackages">
    <div
      v-for="(map, carrierId, idx) in carrierBundledItemsMap"
      :key="`delivery-block-carrier-${carrierId}`"
      class="rounded-t-md border border-gray-350 border-b-transparent bg-white md:mb-4 md:rounded-md md:border-b-gray-350">
      <div v-if="variants" id="imageHeader">
        <OrderStatusBar
          v-bind="map.deliveryInfo"
          :index="idx"
          class="p-5 md:border-b md:border-b-gray-350" />
        <div
          v-for="{ key, ...data } in map.items"
          :key="key"
          class="flex space-x-4 px-5 pb-5">
          <OrderItemCard
            v-bind="data"
            data-test-id="order-item-card"
            :delivery-status="map.deliveryInfo.formattedStatus"
            :quantity="getItemQuantity(data.variant.id)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ListOfPackages, Order } from '@scayle/storefront-nuxt'
import { PropType } from 'nuxt/dist/app/compat/capi'
import { OrderProduct, OrderVariant } from '~/types/osp'

type Package = ListOfPackages[0]

export type DeliveryInfo = Package & { formattedStatus: string }

type OrderItems = (Exclude<
  Exclude<Order['items'], undefined>[number],
  'product' | 'variant'
> & {
  product: OrderProduct
  variant: OrderVariant
})[]

type CarrierMap = Record<
  string,
  { items: OrderItems; deliveryInfo: DeliveryInfo }
>

const props = defineProps({
  variants: {
    type: Array as PropType<OrderVariant[]>,
    default: undefined,
  },
  orderItems: {
    type: Array as PropType<OrderItems>,
    default: () => [],
  },
  packages: {
    type: Array as PropType<ListOfPackages>,
    default: () => [],
  },
})

const uniqueItems = computed(() => {
  return useUnique(props.orderItems, (it: OrderItems[0]) => it.variant.id)
})

const carrierBundledItemsMap = computed<CarrierMap>(() => {
  // every item has a packageId
  // every carrier has a package id
  return props.packages.reduce((carrierMap: CarrierMap, pkg: Package) => {
    const items = uniqueItems.value?.filter(
      (it: OrderItems[0]) => it.packageId === pkg.id,
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
