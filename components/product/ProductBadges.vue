<template>
  <div class="flex size-max flex-col space-y-1">
    <ProductBadge
      v-if="isProductSustainable(product)"
      badge-label="sustainable"
      class="ml-1"
    />
    <ProductBadge v-if="product.isNew" badge-label="new" class="ml-1" />
    <ProductBadge
      v-for="(campaign, idx) in getSalesRelativeAmountByCategory(
        product,
        'campaign',
      )"
      :key="`campaign-${idx}`"
      class="mx-1 w-max bg-[#ff6e17]"
      :badge-label="`-${campaign.amount.relative * 100}% EXTRA`"
      :translate="false"
    />
    <ProductBadge
      v-for="(sale, idx) in getSalesRelativeAmountByCategory(product, 'sale')"
      :key="`sale-${idx}`"
      class="mx-1 w-max bg-red-500"
      :badge-label="`-${sale.amount.relative * 100}%`"
      :translate="false"
    />
    <ProductPromotionBadges :product="product" class="ml-1" />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

defineProps<{ product: Product }>()
</script>
