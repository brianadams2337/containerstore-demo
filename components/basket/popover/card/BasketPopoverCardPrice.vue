<template>
  <div class="flex items-end">
    <section class="flex flex-col items-end justify-end">
      <p v-if="reducedPrice" class="text-sm text-gray-500 line-through">
        {{ formatCurrency(price + reducedPrice) }}
      </p>
      <Headline
        tag="p"
        size="base"
        is-uppercase
        :class="{ 'text-red-500': reducedPrice }"
      >
        {{ formatCurrency(price) }}
      </Headline>
      <p class="text-xs text-secondary">
        {{ $t('incl_tax') }}
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { type BasketItem } from '@scayle/storefront-nuxt'

const props = defineProps<{ item: BasketItem }>()

const { formatCurrency } = useFormatHelpers()
const basketItem = computed(() => props.item)

const { price, reducedPrice } = await useBasketItem(basketItem)
</script>
