<template>
  <div class="flex flex-col">
    <CategorySuggestions
      v-if="categories.length"
      :items="categories"
      :label="$t('search.categories')"
      @click:result="emit('click:result', $event)"
    />
    <ProductSuggestions
      v-if="products.length"
      :items="products"
      :label="$t('search.product')"
      show-images
      @click:result="emit('click:result', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type {
  CategorySearchSuggestion,
  ProductSearchSuggestion,
  SearchEntity,
} from '@scayle/storefront-nuxt'
import CategorySuggestions from './CategorySuggestions.vue'
import ProductSuggestions from './ProductSuggestions.vue'

type Props = {
  products?: ProductSearchSuggestion[]
  categories?: CategorySearchSuggestion[]
}

withDefaults(defineProps<Props>(), {
  products: () => [],
  categories: () => [],
})

const emit = defineEmits<{ 'click:result': [value: SearchEntity] }>()
</script>
