<template>
  <section>
    <label
      v-if="label"
      class="mb-2.5 block text-sm font-semibold"
      :for="`${label}-product-list`">
      <slot name="label">{{ label }}</slot>
    </label>
    <ul :id="`${label}-product-list`" class="space-y-2.5">
      <slot
        v-for="{ productSuggestion } in items"
        name="item"
        :item="productSuggestion"
        :search-term="searchTerm">
        <SearchResultItem
          v-if="productSuggestion"
          :key="productSuggestion.product.id"
          :term="searchTerm"
          :to="getProductDetailRoute(productSuggestion.product)"
          :image-url="getImageUrl(productSuggestion)"
          @click:result="emit('click:result', productSuggestion)">
          <div class="w-full overflow-hidden">
            <div class="truncate text-2xs font-medium text-secondary">
              {{ getCategoryName(productSuggestion) }}
            </div>
            <div
              class="flex overflow-hidden text-sm font-semibold text-primary">
              <div class="shrink truncate">
                {{ productSuggestion.suggestion }}
              </div>
              <div
                v-if="productSuggestion.product.priceRange"
                class="ml-auto shrink-0">
                {{
                  toCurrency(productSuggestion.product.priceRange.min.withTax)
                }}
              </div>
            </div>
          </div>
        </SearchResultItem>
      </slot>
    </ul>
  </section>
</template>

<script setup lang="ts">
import {
  ProductSuggestion,
  TypeaheadProductSuggestion,
} from '@scayle/storefront-nuxt'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  items: {
    type: Array as PropType<TypeaheadProductSuggestion[]>,
    default: () => [],
  },
  searchTerm: {
    type: String,
    default: '',
  },
  showImages: {
    type: Boolean,
    default: false,
  },
})

const getCategoryName = (productSuggestion: ProductSuggestion) => {
  return productSuggestion.product.categories?.[0]?.at(-1)?.categoryName
}

const getImageUrl = (productSuggestion: ProductSuggestion) => {
  return props.showImages
    ? getFirstModelImage(productSuggestion.product.images).hash
    : ''
}

const emit = defineEmits<{
  (e: 'click:result', value: ProductSuggestion): void
}>()
</script>
