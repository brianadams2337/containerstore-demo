<template>
  <section>
    <label
      v-if="label"
      class="mb-2.5 block text-sm font-semibold"
      :for="`${label}-category-list`"
    >
      {{ label }}
    </label>
    <ul :id="`${label}-category-list`" class="space-y-2.5">
      <SearchResultItem
        v-for="{ brandOrCategorySuggestion } in items"
        :key="brandOrCategorySuggestion.category.id"
        :term="searchTerm"
        :to="brandOrCategorySuggestion.category.path"
        @click:result="emit('click:result', brandOrCategorySuggestion)"
      >
        <div class="overflow-hidden">
          <div class="truncate text-2xs font-medium text-secondary">
            {{ brandOrCategorySuggestion.category.path }}
          </div>
          <div class="truncate text-sm font-semibold text-primary">
            {{ brandOrCategorySuggestion.category.name }}
          </div>
        </div>
      </SearchResultItem>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type {
  BrandOrCategorySuggestion,
  TypeaheadBrandOrCategorySuggestion,
} from '@scayle/storefront-nuxt'

type Props = {
  label: string
  searchTerm?: string
  items?: TypeaheadBrandOrCategorySuggestion[]
}

withDefaults(defineProps<Props>(), { items: () => [], searchTerm: '' })

const emit = defineEmits<{
  'click:result': [value: BrandOrCategorySuggestion]
}>()
</script>
