<template>
  <section>
    <label
      v-if="label"
      class="mb-2.5 block text-sm font-semibold"
      :for="`${label}-product-list`"
    >
      {{ label }}
    </label>
    <ul :id="`${label}-product-list`" class="space-y-2.5">
      <SearchResultItem
        v-for="{ productSuggestion } in items"
        :key="productSuggestion.product.id"
        :term="searchTerm"
        :to="getProductDetailRoute(productSuggestion.product)"
        :image-url="getImageUrl(productSuggestion)"
        @click:result="emit('click:result', productSuggestion)"
      >
        <div class="w-full overflow-hidden">
          <div class="truncate text-2xs font-medium text-secondary">
            {{ getCategoryName(productSuggestion) }}
          </div>
          <div class="flex overflow-hidden text-sm font-semibold text-primary">
            <div class="shrink truncate">
              {{ productSuggestion.suggestion }}
            </div>
            <div
              v-if="productSuggestion.product.priceRange"
              class="ml-auto shrink-0"
            >
              {{
                formatCurrency(productSuggestion.product.priceRange.min.withTax)
              }}
            </div>
          </div>
        </div>
      </SearchResultItem>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type {
  ProductSuggestion,
  TypeaheadProductSuggestion,
} from '@scayle/storefront-nuxt'

type Props = {
  label: string
  items: TypeaheadProductSuggestion[]
  searchTerm?: string
  showImages?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  searchTerm: '',
  showImages: false,
})

const { formatCurrency } = useFormatHelpers()
const { getProductDetailRoute } = useRouteHelpers()

const getCategoryName = (productSuggestion: ProductSuggestion) => {
  return productSuggestion.product.categories?.[0]?.at(-1)?.categoryName
}

const getImageUrl = (productSuggestion: ProductSuggestion) => {
  return props.showImages
    ? getFirstModelImage(productSuggestion.product.images).hash
    : ''
}

const emit = defineEmits<{ 'click:result': [value: ProductSuggestion] }>()
</script>
