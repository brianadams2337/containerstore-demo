<template>
  <div>
    <slot
      v-for="{ brandOrCategorySuggestion } in items"
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
          <div class="text-2xs text-secondary truncate font-medium">
            {{ brandOrCategorySuggestion.category.path }}
          </div>
          <div class="text-primary truncate text-sm font-semibold">
            {{ brandOrCategorySuggestion.category.name }}
          </div>
        </div>
      </SearchResultItem>
    </slot>
  </div>
</template>

<script setup lang="ts">
import {
  BrandOrCategorySuggestion,
  TypeaheadBrandOrCategorySuggestion,
} from '@scayle/storefront-nuxt'

defineProps({
  items: {
    type: Array as PropType<TypeaheadBrandOrCategorySuggestion[]>,
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

const emit = defineEmits<{
  (e: 'click:result', value: BrandOrCategorySuggestion): void
}>()
</script>
