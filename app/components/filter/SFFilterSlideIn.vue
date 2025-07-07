<template>
  <SFSlideIn
    name="FilterSlideIn"
    :close-on-route-change="false"
    @open="onSlideInOpen"
    @close="onSlideInClose"
  >
    <template #slide-in-header="{ toggle: toggleItem }">
      <SFFilterHeader :toggle-item="toggleItem" />
    </template>
    <template #slide-in-body>
      <SFFilterSlideInContent
        :hide-sorting="hideSorting"
        :applied-attribute-values="appliedAttributeValues"
        :applied-boolean-values="appliedBooleanValues"
        :applied-filter="appliedFilter"
        :available-filters="availableFilters"
        :selected-sort="selectedSort"
        :sort-links="sortLinks"
        @apply-price-filter="applyPriceFilter"
        @apply-attribute-filter="applyAttributeFilter"
        @apply-boolean-filter="applyBooleanFilter"
        @reset-price-filter="resetPriceFilter"
        @reset-reduction-filter="resetReductionFilter"
        @apply-reduction-filter="applyReductionFilter"
        @reset="resetFilter"
      />
    </template>
    <template #slide-in-actions>
      <SFFilterActions
        :are-filters-cleared="areFiltersCleared"
        :filtered-product-count="filteredProductCount"
        @reset="resetFilters"
      />
    </template>
  </SFSlideIn>
</template>

<script setup lang="ts">
import type { SortLink, SelectedSort } from '@scayle/storefront-product-listing'
import SFFilterSlideInContent from './SFFilterSlideInContent.vue'
import SFFilterActions from './SFFilterActions.vue'
import SFFilterHeader from './SFFilterHeader.vue'
import { useFilter } from '~/composables'
import { SFSlideIn } from '#storefront-ui/components'
import { useAppliedFilters } from '#storefront-product-listing'
import { useRoute } from '#app/composables/router'

const {
  currentCategoryId,
  hideSorting = false,
  selectedSort = undefined,
  sortLinks = [],
} = defineProps<{
  currentCategoryId?: number
  hideSorting?: boolean
  selectedSort?: SelectedSort
  sortLinks?: SortLink[]
}>()

const { appliedBooleanValues, appliedFilter, appliedAttributeValues } =
  useAppliedFilters(useRoute())

const {
  availableFilters,
  onSlideInOpen,
  onSlideInClose,
  applyPriceFilter,
  applyReductionFilter,
  applyAttributeFilter,
  applyBooleanFilter,
  resetPriceFilter,
  resetReductionFilter,
  resetFilters,
  resetFilter,
  filteredProductCount,
  areFiltersCleared,
} = useFilter(() => currentCategoryId)
</script>
