<template>
  <div class="flex flex-col">
    <span class="mb-2.5 block text-sm font-semibold">
      {{
        $t('search.search_term_match_count', {
          count: resultsCount,
          term,
        })
      }}
    </span>
    <CategorySuggestions
      v-if="categories.length"
      :items="categories.slice(0, categoryLimit)"
      :search-term="term"
      :label="showLabels ? $t('search.categories') : ''"
      @click:result="emit('click:result', $event)" />
    <ProductSuggestions
      v-if="productSuggestions.length"
      class="mt-4"
      :items="productSuggestions.slice(0, productLimit)"
      :search-term="term"
      :label="$t('search.product')"
      show-images
      @click:result="emit('click:result', $event)" />
  </div>
</template>

<script setup lang="ts">
import {
  BrandOrCategorySuggestion,
  ProductSuggestion,
  TypeaheadBrandOrCategorySuggestion,
  TypeaheadProductSuggestion,
} from '@scayle/storefront-nuxt'
import { PRODUCT_LIMIT, CATEGORY_LIMIT } from '~/constants'

defineProps({
  productLimit: {
    type: Number,
    default: PRODUCT_LIMIT,
  },
  categoryLimit: {
    type: Number,
    default: CATEGORY_LIMIT,
  },
  term: {
    type: String,
    default: '',
  },
  resultsCount: {
    type: Number,
    default: 0,
  },
  showLabels: {
    type: Boolean,
    default: true,
  },
  productSuggestions: {
    type: Array as PropType<TypeaheadProductSuggestion[]>,
    default: () => [],
  },
  categories: {
    type: Array as PropType<TypeaheadBrandOrCategorySuggestion[]>,
    default: () => [],
  },
  fetching: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (
    e: 'click:result',
    value: BrandOrCategorySuggestion | ProductSuggestion,
  ): void
}>()
</script>
