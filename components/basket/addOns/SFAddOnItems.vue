<template>
  <div class="w-full cursor-pointer" @click="isOpen = !isOpen">
    <div class="flex items-center">
      <SFBasketCardDetail label="Add Ons" primary />
      <IconDropdown class="ml-2.5 size-2.5" :class="{ 'rotate-180': isOpen }" />
      <SFFadeInTransition :duration="300">
        <div class="flex-1 text-right" :class="{ 'opacity-0': isOpen }">
          <p class="text-xs font-bold">
            {{ formatCurrency(totalCostOfAddOns) }}
          </p>
          <p class="text-2xs font-medium opacity-50">
            {{ $t('incl_tax') }}
          </p>
        </div>
      </SFFadeInTransition>
    </div>
    <SFFadeInTransition>
      <div v-if="isOpen">
        <SFAddOnItem
          v-for="item in items"
          :key="`add-on-item-${item.key}`"
          :add-on="item"
          :size-mode="sizeMode"
        />
      </div>
    </SFFadeInTransition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { BasketItem } from '@scayle/storefront-nuxt'
import SFBasketCardDetail from '../card/SFBasketCardDetail.vue'
import SFAddOnItem from './SFAddOnItem.vue'
import { useFormatHelpers } from '#storefront/composables'
import { SFFadeInTransition } from '#storefront-ui/components'

type Props = {
  items: BasketItem[]
  sizeMode?: 'md' | 'sm'
}

const props = withDefaults(defineProps<Props>(), { sizeMode: 'md' })

const { formatCurrency } = useFormatHelpers()

const isOpen = ref(false)

const getPrice = (item: BasketItem) => item.price.total.withTax

const totalCostOfAddOns = computed(() => {
  return props.items.reduce((total, item) => total + getPrice(item), 0)
})
</script>
