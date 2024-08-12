<template>
  <section>
    <label
      v-if="label"
      class="mb-3 mt-1 block text-sm font-semibold"
      :for="`${label}-category-list`"
    >
      {{ label }}
    </label>
    <ul :id="`${label}-category-list`" class="space-y-2.5">
      <SearchResultItem
        v-for="item in items"
        :key="item.categorySuggestion.category.id"
        :to="buildCategorySuggestionRoute(item)"
        :filters="item.categorySuggestion.filters"
        @click:result="emit('click:result', item)"
      >
        <CategorySuggestionContent v-bind="item.categorySuggestion" />
      </SearchResultItem>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { CategorySearchSuggestion } from '@scayle/storefront-nuxt'
import { useRouteHelpers } from '~/composables/useRouteHelpers'

type Props = {
  label: string
  items?: CategorySearchSuggestion[]
}

withDefaults(defineProps<Props>(), { items: () => [] })

const { buildCategorySuggestionRoute } = useRouteHelpers()

const emit = defineEmits<{
  'click:result': [value: CategorySearchSuggestion]
}>()
</script>
