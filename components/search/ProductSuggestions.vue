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
        :image-url="getImageUrl(productSuggestion)"
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
              {{
                getCurrency(productSuggestion.product.priceRange.min.withTax)
              }}
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

const props = defineProps({
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

const currentShop = useCurrentShop()

const getCurrency = (value: number): string => {
  if (!currentShop.value) {
    return ''
  }

  return toCurrency(
    value,
    usePick(currentShop.value, [
      'locale',
      'currency',
      'currencyFractionDigits',
    ]),
  )
}

const getCategoryName = (productSuggestion: ProductSuggestion) => {
  return productSuggestion.product.categories?.[0]?.at(-1)?.categoryName
}

const getImageUrl = (productSuggestion: ProductSuggestion) => {
  return props.showImages
    ? image.getFirstModelImage(productSuggestion.product.images).hash
    : ''
}

const emit = defineEmits<{
  (e: 'click:result', value: ProductSuggestion): void
}>()
</script>
