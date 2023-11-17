<template>
  <div class="flex h-max w-max flex-col">
    <ProductBadge
      v-if="isProductSustainable(product)"
      badge-label="sustainable"
      class="ml-2"
    />
    <ProductBadge v-if="product.isNew" badge-label="new" class="ml-2" />
    <ProductBadge
      v-for="(campaign, idx) in getSalesRelativeAmountByCategory(
        product,
        'campaign',
      )"
      :key="`campaign-${idx}`"
      class="mx-2 w-max bg-[#ff6e17] last-of-type:mr-0"
      :badge-label="`-${campaign.amount.relative * 100}% EXTRA`"
      :translate="false"
    />
    <ProductBadge
      v-for="(sale, idx) in getSalesRelativeAmountByCategory(product, 'sale')"
      :key="`sale-${idx}`"
      class="mx-2 w-max bg-red-500"
      :badge-label="`-${sale.amount.relative * 100}%`"
      :translate="false"
    />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

defineProps({
  product: {
    type: Object as PropType<Product>,
    default: () => ({}),
  },
})
</script>
