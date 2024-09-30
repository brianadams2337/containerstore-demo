<template>
  <div class="min-h-[9.25rem] max-md:pl-2 md:min-h-[6.375rem]">
    <div class="relative w-full overflow-hidden md:h-[5.375rem]">
      <div
        class="mt-2 block transition-all delay-0 duration-200 ease-in transition-discrete group-hover/product-card:block group-hover/product-card:translate-y-0 group-hover/product-card:opacity-100 group-hover/product-card:delay-100 group-hover/product-card:starting:translate-y-4 group-hover/product-card:starting:opacity-0 md:mt-3 md:hidden md:translate-y-4 md:opacity-0"
      >
        <ProductCardSiblingsPicker v-bind="{ product, siblings }" :limit="2" />
      </div>
      <div
        class="mt-3 flex flex-col opacity-100 transition-all delay-100 duration-200 ease-in transition-discrete group-hover/product-card:delay-0 loaded:starting:opacity-0 max-md:mb-6 md:absolute md:inset-0 md:mt-5 group-hover/product-card:md:hidden group-hover/product-card:md:opacity-0"
      >
        <p
          data-testid="product-card-product-brand"
          class="mb-2.5 truncate text-base font-semi-bold-variable text-gray-900"
        >
          {{ brand }}
        </p>
        <p
          data-testid="product-card-product-name"
          class="truncate text-sm text-gray-600"
        >
          {{ name }}
        </p>
      </div>
    </div>
    <ProductPrice
      v-if="price"
      :promotion="promotion"
      :price="price"
      :show-price-from="showPriceFrom"
      class="absolute bottom-0 left-2 md:left-0"
    />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'
import { computed } from 'vue'
import ProductPrice from '../ProductPrice.vue'
import ProductCardSiblingsPicker from './siblings/ProductCardSiblingsPicker.vue'
import { useProductBaseInfo, useProductPromotions } from '~/composables'

const props = defineProps<{ product: Product }>()

const {
  brand,
  name,
  price,
  nonSoldOutSiblings: siblings,
} = useProductBaseInfo(props.product)

const showPriceFrom = computed(
  () =>
    props.product.priceRange?.min.withTax !==
    props.product.priceRange?.max.withTax,
)

const { promotion } = useProductPromotions(props.product)
</script>
