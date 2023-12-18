<template>
  <div class="w-full cursor-pointer" @click="isOpen = !isOpen">
    <div class="flex items-center">
      <BasketCardDetail label="Add Ons" primary />
      <IconDropdown
        class="ml-2.5 h-2.5 w-2.5"
        :class="{ 'rotate-180': isOpen }"
      />
      <FadeInTransition :duration="300">
        <div class="flex-1 text-right" :class="{ 'opacity-0': isOpen }">
          <p class="text-xs font-bold">
            {{ formatCurrency(totalCostOfAddOns) }}
          </p>
          <p class="text-2xs font-medium opacity-50">
            {{ $t('incl_tax') }}
          </p>
        </div>
      </FadeInTransition>
    </div>
    <FadeInTransition>
      <div v-if="isOpen">
        <AddOnItem
          v-for="item in items"
          :key="`add-on-item-${item.key}`"
          :add-on="item"
          :size-mode="sizeMode"
        />
      </div>
    </FadeInTransition>
  </div>
</template>

<script setup lang="ts">
import type { BasketItem } from '@scayle/storefront-nuxt'

const props = defineProps({
  items: {
    type: Array as PropType<BasketItem[]>,
    required: true,
  },
  sizeMode: {
    type: String as PropType<'md' | 'sm'>,
    default: 'md',
  },
})

const { formatCurrency } = useFormatHelpers()

const isOpen = ref(false)

const getPrice = (item: BasketItem) => item.price.total.withTax

const totalCostOfAddOns = computed(() => {
  return props.items.reduce((total, item) => total + getPrice(item), 0)
})
</script>
