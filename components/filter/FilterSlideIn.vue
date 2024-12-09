<template>
  <SFSlideIn name="FilterSlideIn" @open="onSlideInOpen" @close="onSlideInClose">
    <template #slide-in-header="{ toggle: toggleItem }">
      <FilterHeader :toggle-item="toggleItem" />
    </template>
    <template #slide-in-body>
      <FilterSlideInContent
        :applied-attribute-values="appliedAttributeValues"
        :applied-boolean-values="appliedBooleanValues"
        :applied-filter="appliedFilter"
        :available-filters="availableFilters"
        @apply-price-filter="applyPriceFilter"
        @apply-attribute-filter="applyAttributeFilter"
        @apply-boolean-filter="applyBooleanFilter"
        @reset-price-filter="resetPriceFilter"
        @reset="resetFilter"
      />
    </template>
    <template #slide-in-actions>
      <FilterActions
        :are-filters-cleared="areFiltersCleared"
        :filtered-product-count="filteredProductCount"
        @reset="resetFilters"
      />
    </template>
  </SFSlideIn>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import FilterSlideInContent from './FilterSlideInContent.vue'
import FilterActions from './FilterActions.vue'
import FilterHeader from './FilterHeader.vue'
import { useFilter } from '~/composables'
import { SFSlideIn } from '#storefront-ui/components'
import { useAppliedFilters } from '#storefront-product-listing'
import { useRoute } from '#app/composables/router'

const props = defineProps<{ currentCategoryId?: number }>()

const { appliedBooleanValues, appliedFilter, appliedAttributeValues } =
  useAppliedFilters(useRoute())

const { currentCategoryId } = toRefs(props)

const {
  availableFilters,
  onSlideInOpen,
  onSlideInClose,
  applyPriceFilter,
  applyAttributeFilter,
  applyBooleanFilter,
  resetPriceFilter,
  resetFilters,
  resetFilter,
  filteredProductCount,
  areFiltersCleared,
} = useFilter(currentCategoryId)
</script>
