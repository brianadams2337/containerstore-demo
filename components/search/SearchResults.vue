<template>
  <div class="flex flex-col">
    <span class="mb-2.5 block text-sm font-semibold">
      {{ $t('search.search_term_match_count', { count: resultsCount, term }) }}
    </span>
    <CategorySuggestions
      v-if="categories.length"
      :items="categories.slice(0, categoryLimit)"
      :search-term="term"
      :label="showLabels ? $t('search.categories') : ''"
      @click:result="emit('click:result', $event)"
    />
    <ProductSuggestions
      v-if="productSuggestions.length"
      class="mt-4"
      :items="productSuggestions.slice(0, productLimit)"
      :search-term="term"
      :label="$t('search.product')"
      show-images
      @click:result="emit('click:result', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type {
  BrandOrCategorySuggestion,
  ProductSuggestion,
  TypeaheadBrandOrCategorySuggestion,
  TypeaheadProductSuggestion,
} from '@scayle/storefront-nuxt'

type Suggestion = BrandOrCategorySuggestion | ProductSuggestion

type Props = {
  productLimit?: number
  categoryLimit?: number
  term?: string
  resultsCount?: number
  showLabels?: boolean
  productSuggestions?: TypeaheadProductSuggestion[]
  categories?: TypeaheadBrandOrCategorySuggestion[]
}

withDefaults(defineProps<Props>(), {
  productLimit: PRODUCT_LIMIT,
  categoryLimit: CATEGORY_LIMIT,
  term: '',
  resultsCount: 0,
  showLabels: true,
  productSuggestions: () => [],
  categories: () => [],
})

const emit = defineEmits<{ 'click:result': [value: Suggestion] }>()
</script>
