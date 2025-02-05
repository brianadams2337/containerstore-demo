<template>
  <SFLink :to="getProductDetailRoute(product.id, name)" class="w-full">
    <div class="w-full divide-y divide-gray-500">
      <div class="flex h-28 justify-between space-x-4 md:space-x-0">
        <div class="mr-2 w-1/5 flex-none">
          <NuxtImg
            :src="imageHash"
            :alt="name"
            :title="name"
            :modifiers="{ bg: 'F8F8F8' }"
            provider="scayle"
            class="h-full object-contain"
            sizes="xs:80px sm:112px lg:192px"
          />
        </div>
        <div class="my-3 flex w-3/5 grow flex-col space-y-0.5">
          <p class="whitespace-normal text-sm font-semibold">
            {{ name }}
            <span v-if="color" class="sm:hidden"> - {{ color }}</span>
          </p>

          <p v-if="size" class="text-sm">
            {{ $t('osp.size') }}: <b>{{ size }}</b>
          </p>

          <p class="text-sm">
            {{ $t('osp.quantity_label') }}: <b>{{ quantity }}</b>
          </p>
        </div>
        <div class="my-3 flex flex-col justify-start text-sm font-semibold">
          <p
            v-if="originalPrice"
            class="text-right"
            :class="{ 'line-through': reducedPrice !== undefined }"
          >
            {{ formatCurrency(originalPrice) }}
          </p>
          <p v-if="reducedPrice" class="text-right text-red-500">
            {{ formatCurrency(quantity * price.withTax) }}
          </p>
          <p
            v-if="
              reducedPrice &&
              lowestPriorPrice?.withTax &&
              lowestPriorPrice?.relativeDifferenceToPrice
            "
            class="mt-0.5 text-right text-sm text-gray-400"
          >
            {{ $t('price.best_price_30d') }}**:
            {{ formatCurrency(lowestPriorPrice.withTax) }}
            ({{ lowestPriorPrice.relativeDifferenceToPrice * 100 }}%)
          </p>
        </div>
      </div>
    </div>
  </SFLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  getFirstAttributeValue,
  getTotalAppliedReductions,
} from '@scayle/storefront-nuxt'
import { useFormatHelpers } from '#storefront/composables'
import { useRouteHelpers } from '~/composables/useRouteHelpers'
import { SFLink } from '#storefront-ui/components'
import { NuxtImg } from '#components'
import type { OrderProduct, OrderVariant, OrderPrice } from '~/types/order'

const {
  quantity = 1,
  product,
  variant,
  price,
} = defineProps<{
  product: OrderProduct
  variant: OrderVariant
  price: OrderPrice
  deliveryStatus: string
  quantity?: number
}>()

const { getProductDetailRoute } = useRouteHelpers()
const { formatCurrency } = useFormatHelpers()
const name = computed(() => product.name)

const color = computed(
  () => getFirstAttributeValue(product.attributes, 'color')?.label,
)

const size = computed(
  () => getFirstAttributeValue(variant?.attributes, 'size')?.label,
)

const imageHash = computed(() => product.images[0].hash)

const reducedPrice = computed(() => {
  if (!price.appliedReductions) {
    return
  }

  return getTotalAppliedReductions({
    appliedReductions: price.appliedReductions,
  }).absoluteWithTax
})

const originalPrice = computed(() => {
  if (!reducedPrice.value) {
    return
  }
  return (
    quantity *
    (reducedPrice.value ? price.withTax + reducedPrice.value : price.withTax)
  )
})

const lowestPriorPrice = computed(() => variant.lowestPriorPrice)
</script>
