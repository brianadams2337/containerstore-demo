<template>
  <div
    class="flex flex-col rounded"
    :class="{
      'bottom-0 left-0 w-full': isPromotionBadgeFullWidth,
      'bottom-2 left-2': !isPromotionBadgeFullWidth,
    }"
  >
    <ProductBadge
      v-if="isProductSustainable(product)"
      badge-label="sustainable"
      class="mb-2 ml-2"
    />
    <ProductBadge v-if="product.isNew" badge-label="new" class="mb-2 ml-2" />
    <ProductBadge
      v-for="(campaign, idx) in getSalesRelativeAmountByCategory(
        product,
        'campaign',
      )"
      :key="`campaign-${idx}`"
      class="mx-2 mb-2 w-max bg-[#ff6e17]"
      :badge-label="`-${campaign.amount.relative * 100}% EXTRA`"
      :translate="false"
    />
    <ProductBadge
      v-for="(sale, idx) in getSalesRelativeAmountByCategory(product, 'sale')"
      :key="`sale-${idx}`"
      class="mb-2 w-max bg-red-500"
      :badge-label="`-${sale.amount.relative * 100}%`"
      :class="{
        'ml-2': !isBasketPage,
      }"
      :translate="false"
    />
    <ProductPromotionBadges
      :product="product"
      :is-full-width="isPromotionBadgeFullWidth"
    />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

const route = useRoute()
const localePath = useLocalePath()

withDefaults(
  defineProps<{ product: Product; isPromotionBadgeFullWidth?: boolean }>(),
  {
    isPromotionBadgeFullWidth: true,
  },
)

const isBasketPage = computed(() => {
  return route.path === localePath(routeList.basket)
})
</script>
