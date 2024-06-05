<template>
  <div class="flex items-center">
    <div
      :class="{
        'w-9': sizeMode === 'sm',
        'w-12': sizeMode === 'md',
      }"
    >
      <NuxtImg
        v-if="imageHash"
        :src="imageHash"
        provider="default"
        class="object-cover"
      />
    </div>
    <div
      class="flex-1 font-bold"
      :class="{
        'ml-4 text-xs': sizeMode === 'sm',
        'ml-8 text-sm ': sizeMode === 'md',
      }"
    >
      {{ name }}
    </div>
    <div class="text-right text-xs font-bold">
      <div v-if="reducedPrice" class="line-through">
        {{ formatCurrency(price + reducedPrice) }}
      </div>
      <div v-else>{{ formatCurrency(price) }}</div>
      <div v-if="reducedPrice" class="text-red-500">
        {{ formatCurrency(price) }}
      </div>
      <p class="text-2xs font-medium opacity-50">
        {{ $t('incl_tax') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType, computed } from 'vue'
import {
  type BasketItem,
  getFirstAttributeValue,
  getTotalAppliedReductions,
} from '@scayle/storefront-nuxt'
import { ProductImageType } from '~/utils/product'
import { getImageFromList } from '~/utils/image'
import { useFormatHelpers } from '#storefront/composables'

const props = defineProps({
  addOn: {
    type: Object as PropType<BasketItem>,
    required: true,
  },
  sizeMode: {
    type: String as PropType<'md' | 'sm'>,
    default: 'md',
  },
})

const { formatCurrency } = useFormatHelpers()

const imageHash = computed(() => {
  return (
    getImageFromList(props.addOn.product.images, ProductImageType.BUST, 'front')
      ?.hash ?? ''
  )
})

const name = computed(() => {
  return getFirstAttributeValue(props.addOn.product.attributes, 'name')?.label
})

const reducedPrice = computed(() => {
  return getTotalAppliedReductions(props.addOn.price.total)?.absoluteWithTax
})

const price = computed(() => props.addOn.price.total.withTax)
</script>
