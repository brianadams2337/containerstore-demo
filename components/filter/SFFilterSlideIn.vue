<template>
  <SFSlideIn name="FilterSlideIn" @open="onSlideInOpen" @close="onSlideInClose">
    <template #slide-in-header="{ toggle: toggleItem }">
      <SFFilterHeader :toggle-item="toggleItem" />
    </template>
    <template #slide-in-body>
      <SFFilterSlideInContent
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
      <SFFilterActions
        :are-filters-cleared="areFiltersCleared"
        :filtered-product-count="filteredProductCount"
        @reset="resetFilters"
      />
    </template>
  </SFSlideIn>
</template>

<script setup lang="ts">
import SFFilterSlideInContent from './SFFilterSlideInContent.vue'
import SFFilterActions from './SFFilterActions.vue'
import SFFilterHeader from './SFFilterHeader.vue'
import { useFilter } from '~/composables'
import { SFSlideIn } from '#storefront-ui/components'
import { useAppliedFilters } from '#storefront-product-listing'
import { useRoute } from '#app/composables/router'

const { currentCategoryId } = defineProps<{ currentCategoryId?: number }>()

const { appliedBooleanValues, appliedFilter, appliedAttributeValues } =
  useAppliedFilters(useRoute())

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
} = useFilter(() => currentCategoryId)
</script>
