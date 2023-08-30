<template>
  <div class="flex flex-col">
    <SearchResultGroup
      v-if="categories.length"
      :items="categories.slice(0, 5)"
      :search-term="term"
      :label="showLabels ? $t('search.categories') : ''"
      @click:result="emit('click:result', $event)">
      <template #label> {{ resultsCount }} Results for {{ term }}</template>
    </SearchResultGroup>
    <SearchResultGroup
      v-if="productSuggestions.length"
      class="mt-4"
      :items="productSuggestions.slice(0, PRODUCT_LIMIT)"
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
import { PRODUCT_LIMIT } from '~/constants/search'

defineProps({
  limit: {
    type: Number as PropType<number>,
    default: PRODUCT_LIMIT,
  },
  term: {
    type: String as PropType<string>,
    default: '',
  },
  resultsCount: {
    type: Number as PropType<number>,
    default: 0,
  },
  showLabels: {
    type: Boolean as PropType<boolean>,
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
})

const emit = defineEmits<{
  (
    e: 'click:result',
    value: BrandOrCategorySuggestion | ProductSuggestion,
  ): void
}>()
</script>
