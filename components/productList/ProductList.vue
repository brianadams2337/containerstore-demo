<template>
  <div>
    <slot v-if="loading" name="loading-content">
      <ProductCardSkeleton
        v-for="index in 20"
        :key="`product-loading-${index}`"
        type="custom"
        :class="columnClasses"
      />
    </slot>

    <template v-else>
      <slot
        v-for="(product, index) in products"
        name="product"
        :product="product"
        :loading="loading"
        :refreshing="refreshing"
      >
        <ProductCard
          :key="`product-${product.id}`"
          class="mb-7"
          :class="columnClasses"
          data-test-id="product-item"
          :index="index"
          :product="product"
          color-chip-size="sm"
          color-chip-rounded-size="sm"
          sibling-spacing="narrow"
          :listing-meta-data="categoryListingMetaData"
          @click:product="$emit('click:product', product, index)"
          @intersect:product="collectRowIntersection(index)"
        >
          <template #badge>
            <ProductBadges
              :product="product"
              class="absolute bottom-0 left-0 w-full"
            />
          </template>
        </ProductCard>
      </slot>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  type Product,
  getRowByIndex,
  isFirstIndexOfRow,
} from '@scayle/storefront-nuxt'

type Props = {
  products?: Product[]
  loading?: boolean
  refreshing?: boolean
  perPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  products: () => [],
  loading: false,
  refreshing: false,
  perPage: PRODUCTS_PER_PAGE,
})

const { isGreaterOrEqual } = useDefaultBreakpoints()

const emit = defineEmits<{
  (e: 'intersect:row', value: { row: number; items: Product[] }): void
  (e: 'click:product', value: Product, i: number): void
}>()

const { products } = toRefs(props)
const route = useRoute()

const currentPage = computed(() => parseInt(route.query.page as string) || 1)

const columns = computed(() => {
  if (isGreaterOrEqual('lg')) {
    return 4
  }
  return isGreaterOrEqual('md') ? 3 : 2
})

const columnClasses = 'col-span-6 md:col-span-4 lg:col-span-3'

const _getRowByIndex = (index: number) =>
  getRowByIndex(index, {
    columns: columns.value,
    page: currentPage.value,
    perPage: 24,
  })

const trackingCollector = ref<{ row: number; items: Product[] }[]>([])

const collectRowIntersection = (index: number) => {
  const row = _getRowByIndex(index)
  const isFirstItemInRow = isFirstIndexOfRow(index, columns.value)

  if (
    isFirstItemInRow &&
    trackingCollector.value.findIndex((item) => item.row === row) === -1
  ) {
    const itemsInRow = products.value
      .slice(index, index + columns.value)
      .map((item, idx) => ({ ...item, index: index + idx }))
    emit('intersect:row', { row, items: itemsInRow })
    trackingCollector.value.push({ row, items: itemsInRow })
  }
}
</script>
