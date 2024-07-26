<template>
  <div class="flex w-full flex-col items-center">
    <div class="grid w-full grid-cols-12 gap-4">
      <slot v-if="loading" name="loading-content">
        <ProductCardSkeleton
          v-for="index in PRODUCT_CARD_SKELETON_LOADERS_SIZE"
          :key="`product-loading-${index}`"
          type="custom"
        />
      </slot>
      <ProductListNoResults
        v-else-if="!products.length"
        :category="currentCategory?.parent"
        class="col-span-12 max-md:mx-4 max-md:w-fit"
      />
      <template v-else>
        <slot
          v-for="(product, index) in products"
          name="product"
          v-bind="{ product, loading }"
          :product="product"
        >
          <ProductCard
            :key="`product-${product.id}`"
            class="col-span-6 mb-5 w-full lg:col-span-4 lg:max-w-[23rem] xl:col-span-3"
            data-testid="product-item"
            v-bind="{ index, product }"
            multiple-images
            edge-borderless
            :is-right-side-borderless="isProductPositionEven(index + 1)"
            :listing-meta-data="categoryListingMetaData"
            @intersect:product="onProductIntersect(index)"
            @click:product="emit('click:product', product, index)"
          >
            <template #header-badges>
              <ProductCardBadgesHeader
                :product="product"
                class="absolute left-3 top-3 w-full"
              />
            </template>
            <template #footer-badges>
              <ProductCardBadgesFooter
                :product="product"
                class="absolute bottom-0 left-0 w-full"
              />
            </template>
          </ProductCard>
        </slot>
        <SFPagination
          v-if="isPaginationShown"
          :total-page-count="pagination.last ?? 0"
          class="col-span-12 mt-6"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRef, computed } from 'vue'
import type {
  Product,
  FetchProductsByCategoryResponse,
  Category,
} from '@scayle/storefront-nuxt'
import { useRowIntersection } from '~/composables'
import {
  PRODUCT_CARD_SKELETON_LOADERS_SIZE,
  categoryListingMetaData,
} from '~/constants'

type Props = {
  products: Product[]
  pagination: FetchProductsByCategoryResponse['pagination']
  loading?: boolean
  isPaginationVisible?: boolean
  currentCategory?: Category
}

const props = withDefaults(defineProps<Props>(), {
  loading: true,
  isPaginationVisible: true,
  currentCategory: undefined,
})

const isProductPositionEven = (index: number) => index % 2 === 0

const isPaginationShown = computed(() => {
  return (
    props.pagination && props.isPaginationVisible && props.pagination.last > 1
  )
})

const { collectRowIntersection } = useRowIntersection(toRef(props.products))

const onProductIntersect = (index: number) => {
  const collectedRowItems = collectRowIntersection(index)
  collectedRowItems && emit('intersect:row', collectedRowItems)
}

const emit = defineEmits<{
  'click:product': [Product, number]
  'intersect:row': [{ row: number; items: Product[] }]
}>()
</script>
