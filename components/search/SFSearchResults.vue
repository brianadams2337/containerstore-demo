<template>
  <div class="space-y-5 bg-white" role="listbox">
    <SFCategorySuggestionList
      v-if="categories.length"
      :category-suggestions="categories"
      @click:result="$emit('click:result', $event)"
    />
    <SFProductSuggestionList
      v-if="products.length"
      :product-suggestions="products"
      @click:result="$emit('click:result', $event)"
    />
    <SFNavigationItemSuggestionList
      v-if="navigationItems.length"
      :search-term="searchTerm"
      :navigation-item-suggestions="navigationItems"
      @click:result="$emit('click:result', $event)"
    />
    <SFShowAllResultsLink
      :search-term="searchTerm"
      role="option"
      @click="$emit('close')"
    />
  </div>
</template>

<script setup lang="ts">
import type {
  CategorySearchSuggestion,
  ProductSearchSuggestion,
  NavigationItemSuggestion as NavigationItemSuggestionType,
  SearchEntity,
} from '@scayle/storefront-core'
import SFProductSuggestionList from './products/SFProductSuggestionList.vue'
import SFNavigationItemSuggestionList from './navigationItem/SFNavigationItemSuggestionList.vue'
import SFCategorySuggestionList from './categories/SFCategorySuggestionList.vue'
import SFShowAllResultsLink from './SFShowAllResultsLink.vue'

type Props = {
  products: ProductSearchSuggestion[]
  categories: CategorySearchSuggestion[]
  navigationItems: NavigationItemSuggestionType[]
  searchTerm: string
}
defineProps<Props>()

defineEmits<{
  (e: 'click:result', value: SearchEntity): void
  (e: 'close'): void
}>()
</script>
