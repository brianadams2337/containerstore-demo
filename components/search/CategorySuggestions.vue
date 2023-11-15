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
            <div class="text-2xs text-secondary truncate font-medium">
              {{ brandOrCategorySuggestion.category.path }}
            </div>
            <div class="text-primary truncate text-sm font-semibold">
              {{ brandOrCategorySuggestion.category.name }}
            </div>
          </div>
        </SearchResultItem>
      </slot>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type {
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
