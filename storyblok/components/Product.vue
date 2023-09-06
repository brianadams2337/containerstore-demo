<template>
  <div class="grid grid-cols-8">
    <ProductCard
      :id="product.id"
      :key="`product-disruptor-${product.id}`"
      :index="product.id"
      :badge-label="badgeLabel"
      :class="{
        'col-span-full': width === '1' || width === undefined,
        'col-span-full md:col-span-4 md:col-start-3':
          (width === '2' && listingColumns === 3) || listingColumns === 1,
        'col-span-full md:col-span-8': width === '2' && listingColumns === 2,
      }"
      :colors="getAttributeValueTuples(product.attributes, 'color')"
      :name="getFirstAttributeValue(product.attributes, 'name')?.label"
      :link="getProductDetailRoute(product)"
      :image="getFirstModelImage(product.images)"
      :hover-images="getModelImages(product.images).reverse()"
      :show-add-to-cart="false"
      :loading="fetching"
      :price="getLowestPrice(product.variants ?? [])"
      :lowest-prior-price="
        getVariantWithLowestPrice(product.variants)?.lowestPriorPrice
      "
      :product="product"
      :variants="product.variants"
      :title="getFirstAttributeValue(product.attributes, 'brand')?.label"
      class="col-span-full"
      @intersect:product="emit('intersect:product', product)">
    </ProductCard>
  </div>
</template>

<script setup lang="ts">
import {
  getLowestPrice,
  getBadgeLabel,
  getFirstAttributeValue,
  getAttributeValueTuples,
  Product as BapiProduct,
} from '@scayle/storefront-nuxt'
const { listingColumns } = useListingUiState()

const props = defineProps({
  width: {
    type: String,
    default: undefined,
  },
  fetching: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  product: {
    type: Object as PropType<BapiProduct>,
    default: () => ({}),
  },
})

const emit = defineEmits(['intersect:product'])
const badgeLabel = computed(() =>
  getBadgeLabel({
    isNew: props.product.isNew,
    isSoldOut: props.product.isSoldOut,
  }),
)
</script>

<script lang="ts">
export default {
  name: 'CmsProduct',
}
</script>
