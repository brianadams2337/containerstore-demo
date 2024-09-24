<template>
  <div class="flex w-full flex-col items-center">
    <div class="grid w-full grid-cols-12 gap-4">
      <template v-if="loading">
        <ProductCardSkeleton
          v-for="index in PRODUCT_CARD_SKELETON_LOADERS_SIZE"
          :key="`product-loading-${index}`"
          type="custom"
        />
      </template>
      <ProductListNoResults
        v-else-if="!products.length"
        :category="currentCategory?.parent"
        class="col-span-12 max-md:mx-4 max-md:w-fit"
      />
      <template v-else>
        <ProductCard
          v-for="(product, index) in products"
          :key="`product-${product.id}`"
          class="col-span-6 mb-5 w-full lg:col-span-4 lg:max-w-[23rem] xl:col-span-3"
          data-testid="product-item"
          :index="index"
          :product="product"
          multiple-images
          edge-borderless
          :is-right-side-borderless="isProductPositionEven(index + 1)"
          :listing-meta-data="categoryListingMetaData"
          @intersect:product="onProductIntersect(index)"
          @click:product="emit('click:product', product, index)"
        />
        <SFPagination
          v-if="isPaginationShown"
          :total-page-count="pagination?.last ?? 0"
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
  pagination: FetchProductsByCategoryResponse['pagination'] | undefined
  loading?: boolean
  isPaginationVisible?: boolean
  currentCategory?: Category | null
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

  if (collectedRowItems) {
    emit('intersect:row', collectedRowItems)
  }
}

const emit = defineEmits<{
  'click:product': [Product, number]
  'intersect:row': [{ row: number; items: (Product & { index: number })[] }]
}>()
</script>
