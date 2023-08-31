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
      <ProductSuggestions
        v-bind="{ searchTerm, showImages }"
        :items="productSuggestions"
        @click:result="emit('click:result', $event)" />
      <CategorySuggestions
        v-bind="{ searchTerm, showImages }"
        :items="brandOrCategorySuggestions"
        @click:result="emit('click:result', $event)" />
    </ul>
  </section>
</template>

<script setup lang="ts">
import {
  ProductSuggestion,
  BrandOrCategorySuggestion,
  TypeaheadSuggestion,
  TypeaheadBrandOrCategorySuggestion,
  TypeaheadProductSuggestion,
} from '@scayle/storefront-nuxt'

const props = defineProps({
  searchTerm: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
  showImages: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array as PropType<TypeaheadSuggestion[]>,
    default: () => [],
  },
})

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
