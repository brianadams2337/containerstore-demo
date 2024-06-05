<template>
  <div class="flex flex-col items-center rounded border border-black p-4">
    <ProductSubscriptionHeader
      is-variant-with-price-reduction
      :total-reductions="totalReductions"
    />
    <ProductSubscriptionSelection
      :product="product"
      :variant="variant"
      :preferred-delivery-date="preferredDeliveryDate"
      :price-promotion-key="pricePromotionKey"
      @add-item-to-basket="$emit('addItemToBasket', $event)"
    />
  </div>
</template>
<script setup lang="ts">
import { useSubscription } from '../composables/useSubscription'
import { toRefs } from 'vue'
import type { Product, Variant } from '@scayle/storefront-nuxt'
import type { PreferredDeliveryDate } from '../helpers/subscription'

type Props = {
  product: Product
  variant?: Variant
  preferredDeliveryDate?: Array<PreferredDeliveryDate>
  pricePromotionKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  preferredDeliveryDate: () => [
    { day: 1, label: 'day_of_month_selection_caption' },
    { day: 15, label: 'day_of_month_selection_caption' },
  ],
  pricePromotionKey: 'subscription',
  variant: undefined,
})

defineEmits(['addItemToBasket'])

const { product, variant, pricePromotionKey } = toRefs(props)
const { selectedPreferredDeliveryDate, totalReductions } =
  await useSubscription(product, pricePromotionKey, variant)

selectedPreferredDeliveryDate.value = props.preferredDeliveryDate[0]
</script>
