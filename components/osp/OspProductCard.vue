<template>
  <div class="w-full divide-y divide-gray-500">
    <div class="my-6 flex h-32 justify-between">
      <div class="w-1/5">
        <NuxtImg
          :src="imageHash"
          provider="default"
          class="max-h-full max-w-full"
        />
      </div>
      <div class="my-2 ml-3 flex w-3/5 flex-col justify-between">
        <p class="text-sm">
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
      <div class="flex flex-col justify-end">
        <p class="text-right" :class="{ 'line-through': reducedPrice }">
          {{
            formatCurrency(
              quantity * (reducedPrice ? price + reducedPrice : price),
            )
          }}
        </p>
        <p v-if="reducedPrice" class="text-right text-red-500">
          {{ formatCurrency(quantity * price) }}
        </p>
        <p
          v-if="
            reducedPrice &&
            lowestPriorPrice?.withTax &&
            lowestPriorPrice?.relativeDifferenceToPrice
          "
          class="mt-0.5 text-right text-sm text-gray-700"
        >
          {{ $t('price.best_price_30d') }}
          {{ formatCurrency(lowestPriorPrice.withTax) }}
          ({{ lowestPriorPrice.relativeDifferenceToPrice * 100 }} %)
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import {
  type AttributeGroup,
  type Attributes,
  getFirstAttributeValue,
  getTotalAppliedReductions,
} from '@scayle/storefront-nuxt'
import { useFormatHelpers } from '#storefront/composables'

const props = defineProps({
  product: {
    type: Object as PropType<OrderProduct>,
    default: () => ({}),
  },
  variant: {
    type: Object as PropType<OrderVariant>,
    default: null,
  },
  price: {
    type: Object as PropType<OrderPrice>,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
})

const { formatCurrency } = useFormatHelpers()

const name = computed(() => props.product.name)

const color = computed(() => {
  const attrs = mapAttributes(props.product.attributes)
  return getFirstAttributeValue(attrs, 'color')?.label
})

const size = computed(() => props.variant.attributes?.size.values.label)

const imageHash = computed(() => props.product.images[0].hash)

const price = computed(() => props.price.withTax)

const reducedPrice = computed(() => {
  if (!props.price.appliedReductions) {
    return
  }

  return getTotalAppliedReductions({
    appliedReductions: props.price.appliedReductions,
  }).absoluteWithTax
})

const lowestPriorPrice = computed(() => props.variant.lowestPriorPrice)

const mapAttributes = (attributes: OrderProduct['attributes']): Attributes => {
  return Object.fromEntries(
    Object.entries(attributes).map(([k, v]) => {
      const val = { ...v, id: null, type: null } as AttributeGroup

      return [k, val]
    }),
  )
}
</script>
