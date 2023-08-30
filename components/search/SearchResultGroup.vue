<template>
  <section>
    <label
      v-if="label"
      class="mb-2.5 block text-sm font-semibold"
      :for="`${label}-list`">
      <slot name="label">
        {{ label }}
      </slot>
    </label>
    <ul :id="`${label}-list`" class="space-y-2.5">
      <slot
        v-for="{ productSuggestion } in productSuggestions"
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
            <div
              class="flex overflow-hidden text-sm font-semibold text-primary">
              <div class="shrink truncate">
                {{ productSuggestion.suggestion }}
              </div>
              <div
                v-if="productSuggestion.product.priceRange"
                class="ml-auto shrink-0">
                USD
                <!-- {{ -->
                <!-- toCurrency(productSuggestion.product.priceRange.min.withTax) -->
                <!-- }} -->
              </div>
            </div>
          </div>
        </SearchResultItem>
      </slot>

      <!-- category -->
      <slot
        v-for="{ brandOrCategorySuggestion } in brandOrCategorySuggestions"
        name="item"
        :item="brandOrCategorySuggestion"
        :search-term="searchTerm">
        <SearchResultItem
          v-if="brandOrCategorySuggestion"
          :key="brandOrCategorySuggestion.category.id"
          :term="searchTerm"
          :to="brandOrCategorySuggestion.category.path"
          @click:result="emit('click:result', brandOrCategorySuggestion)">
          <div class="overflow-hidden">
            <div class="truncate text-2xs font-medium text-secondary">
              {{ brandOrCategorySuggestion.category.path }}
            </div>
            <div class="truncate text-sm font-semibold text-primary">
              {{ brandOrCategorySuggestion.category.name }}
            </div>
          </div>
        </SearchResultItem>
      </slot>
    </ul>
  </section>
</template>

<script setup lang="ts">
import {
  // toCurrency,
  ProductSuggestion,
  BrandOrCategorySuggestion,
  TypeaheadSuggestion,
  TypeaheadBrandOrCategorySuggestion,
  TypeaheadProductSuggestion,
} from '@scayle/storefront-nuxt'

const props = defineProps({
  searchTerm: {
    type: String as PropType<string>,
    default: '',
  },
  label: {
    type: String as PropType<string>,
    required: true,
  },
  items: {
    type: Array as PropType<TypeaheadSuggestion[]>,
    default: () => [],
  },
  showImages: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
})

const getCategoryName = (productSuggestion: ProductSuggestion) => {
  return productSuggestion.product.categories?.[0]?.at(-1)?.categoryName
}

const brandOrCategorySuggestions = computed(() => {
  return props.items.filter(
    (item): item is TypeaheadBrandOrCategorySuggestion => {
      return item.type === 'brandOrCategory'
    },
  )
})
const productSuggestions = computed(() => {
  return props.items.filter((item): item is TypeaheadProductSuggestion => {
    return item.type === 'product'
  })
})

const emit = defineEmits<{
  (
    e: 'click:result',
    value: BrandOrCategorySuggestion | ProductSuggestion,
  ): void
}>()
</script>
