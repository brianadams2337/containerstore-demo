<template>
  <section>
    <label
      v-if="label"
      class="mb-2.5 block text-sm font-semibold"
      :for="`${label}-category-list`">
      <slot name="label">{{ label }}</slot>
    </label>
    <ul :id="`${label}-category-list`" class="space-y-2.5">
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
  BrandOrCategorySuggestion,
  TypeaheadBrandOrCategorySuggestion,
} from '@scayle/storefront-nuxt'

defineProps({
  label: {
    type: String,
    required: true,
  },
  items: {
    type: Array as PropType<TypeaheadBrandOrCategorySuggestion[]>,
    default: () => [],
  },
  searchTerm: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{
  (e: 'click:result', value: BrandOrCategorySuggestion): void
}>()
</script>
