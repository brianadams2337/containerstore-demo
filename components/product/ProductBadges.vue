<template>
  <div
    data-test-id="product-badges"
    class="flex flex-col rounded"
    :class="
      isPromotionBadgeFullWidth
        ? 'bottom-0 left-0 max-w-full '
        : 'items-start w-full'
    "
  >
    <ProductBadge
      v-if="isProductSustainable(product)"
      :text="$t('badge_labels.sustainable')"
      class="mb-2"
      :class="{
        'ml-2': !isBasketPage,
        'ml-0 !max-w-full truncate': isBasketPage,
      }"
    />
    <ProductBadge
      v-if="product.isNew"
      :text="$t('badge_labels.new')"
      class="mb-2"
      :class="{
        'ml-2': !isBasketPage,
        'ml-0 !max-w-full truncate': isBasketPage,
      }"
    />
    <ProductBadge
      v-for="(campaign, idx) in getSalesRelativeAmountByCategory(
        product,
        'campaign',
      )"
      :key="`campaign-${idx}`"
      class="mx-2 mb-2 truncate bg-[#ff6e17]"
      :class="{ 'mx-0 !max-w-full truncate': isBasketPage }"
      :text="
        $t('badge_labels.campaign', {
          reduction: getRelativeReduction(campaign),
        })
      "
    />
    <ProductBadge
      v-for="(sale, idx) in getSalesRelativeAmountByCategory(product, 'sale')"
      :key="`sale-${idx}`"
      class="mb-2 truncate bg-red-500"
      :class="{
        'ml-2 ': !isBasketPage,
        'mb-2 !max-w-full': isBasketPage,
      }"
      :text="$t('badge_labels.sale', { reduction: getRelativeReduction(sale) })"
    />
    <ProductPromotionBadges
      :product="product"
      :is-full-width="isPromotionBadgeFullWidth"
      :class="{ '!max-w-full': isBasketPage }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AppliedReduction, Product } from '@scayle/storefront-nuxt'
import { routeList } from '~/utils/route'
import { useLocalePath } from '#i18n'
import { useRoute } from '#app/composables/router'
import { isProductSustainable } from '~/utils/sustainability'

type Props = {
  product: Product
  isPromotionBadgeFullWidth?: boolean
}

withDefaults(defineProps<Props>(), { isPromotionBadgeFullWidth: true })

const route = useRoute()
const localePath = useLocalePath()

const isBasketPage = computed(() => route.path === localePath(routeList.basket))

const getRelativeReduction = ({ amount }: AppliedReduction) => {
  return amount.relative * 100
}
</script>
