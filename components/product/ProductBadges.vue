<template>
  <div
    data-test-id="product-badges"
    class="flex flex-col rounded"
    :class="{
      'bottom-0 left-0 max-w-full ': isPromotionBadgeFullWidth,
      'items-start w-full': !isPromotionBadgeFullWidth,
    }"
  >
    <ProductBadge
      v-if="isProductSustainable(product)"
      :text="$t('badge_labels.sustainable')"
      class="mb-2"
      :class="{
        'ml-2': !isBasketPage,
        'ml-0 truncate !max-w-full': isBasketPage,
      }"
    />
    <ProductBadge
      v-if="product.isNew"
      :text="$t('badge_labels.new')"
      class="mb-2"
      :class="{
        'ml-2': !isBasketPage,
        'ml-0 truncate !max-w-full': isBasketPage,
      }"
    />
    <ProductBadge
      v-for="(campaign, idx) in getSalesRelativeAmountByCategory(
        product,
        'campaign',
      )"
      :key="`campaign-${idx}`"
      class="mx-2 mb-2 bg-[#ff6e17] truncate"
      :class="{
        'ml-0 mx-0 truncate !max-w-full': isBasketPage,
      }"
      :text="
        $t('badge_labels.campaign', {
          reduction: campaign.amount.relative * 100,
        })
      "
    />
    <ProductBadge
      v-for="(sale, idx) in getSalesRelativeAmountByCategory(product, 'sale')"
      :key="`sale-${idx}`"
      class="mb-2 bg-red-500 truncate"
      :class="{
        'ml-2 ': !isBasketPage,
        'mb-2 !max-w-full': isBasketPage,
      }"
      :text="$t('badge_labels.sale', { reduction: sale.amount.relative * 100 })"
    />
    <ProductPromotionBadges
      :product="product"
      :is-full-width="isPromotionBadgeFullWidth"
      :class="{
        '!max-w-full': isBasketPage,
      }"
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
