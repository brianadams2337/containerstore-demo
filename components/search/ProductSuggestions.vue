<template>
  <div>
    <slot
      v-for="{ productSuggestion } in items"
      name="item"
      :item="productSuggestion"
      :search-term="searchTerm">
      <SearchResultItem
        v-if="productSuggestion"
        :key="productSuggestion.product.id"
        :term="searchTerm"
        :to="route.getProductDetailRoute(productSuggestion.product)"
        :image-url="
          showImages
            ? image.getFirstModelImage(productSuggestion.product.images).hash
            : ''
        "
        @click:result="emit('click:result', productSuggestion)">
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
              class="ml-auto shrink-0">
              USD
              <!-- TODO: Use this after we implemented this utility within the SFC -->
              <!--   {{ price.toCurrency( -->
              <!--     productSuggestion.product.priceRange.min.withTax, -->
              <!--   ) }} -->
            </div>
          </div>
        </div>
      </SearchResultItem>
    </slot>
  </div>
</template>

<script setup lang="ts">
import {
  ProductSuggestion,
  TypeaheadProductSuggestion,
} from '@scayle/storefront-nuxt'

defineProps({
  items: {
    type: Array as PropType<TypeaheadProductSuggestion[]>,
    default: () => [],
  },
  searchTerm: {
    type: String as PropType<string>,
    default: '',
  },
  showImages: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
})

const getCategoryName = (productSuggestion: ProductSuggestion) => {
  return productSuggestion.product.categories?.[0]?.at(-1)?.categoryName
}

const emit = defineEmits<{
  (e: 'click:result', value: ProductSuggestion): void
}>()
</script>
