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
        :unfiltered-count="unfilteredCount"
        @reset="resetFilters"
      />
    </template>
  </SFSlideIn>
</template>

<script setup lang="ts">
import type { Category } from '@scayle/storefront-nuxt'
import { toRef } from 'vue'
import { useAppliedFilters, useFilter } from '~/composables'

const props = defineProps<{ currentCategory?: Category }>()

const { appliedBooleanValues, appliedFilter, appliedAttributeValues } =
  useAppliedFilters()

const currentCategory = props.currentCategory
  ? toRef(props.currentCategory)
  : undefined

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
  unfilteredCount,
  areFiltersCleared,
} = await useFilter(currentCategory)
</script>
