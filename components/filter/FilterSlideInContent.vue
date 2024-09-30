<template>
  <FilterGroup class="md:hidden" :label="$t('filter.sorting')">
    <SortSelection />
  </FilterGroup>
  <template v-for="(filter, index) in availableFilters" :key="filter.slug">
    <FilterGroup
      v-if="
        filter.type === 'range' &&
        filter.values[0]?.min !== filter.values[0]?.max
      "
      :label="filter.name"
      :show-action="
        !!(appliedFilter.maxPrice || appliedFilter.minPrice) &&
        (appliedFilter.minPrice !== filter.values[0]?.min ||
          appliedFilter.maxPrice !== filter.values[0]?.max)
      "
      :class="{ 'border-t': index !== 0 }"
      @click:reset="$emit('resetPriceFilter')"
    >
      <SFRangeSlider
        :model-value="getPriceRange(filter.values[0].min, filter.values[0].max)"
        class="mt-10"
        :max="filter.values[0]?.max"
        :min="filter.values[0]?.min"
        @drag-end="$emit('applyPriceFilter', $event)"
        @change="$emit('applyPriceFilter', $event)"
      />
    </FilterGroup>
    <FilterGroup
      v-if="filter.type === 'boolean'"
      :class="{ 'border-t': index !== 0 }"
    >
      <SFCheckbox
        :id="filter.name"
        :model-value="appliedBooleanValues[filter.slug]"
        :label="filter.name"
        @change="
          $emit('applyBooleanFilter', filter.slug, $event.target.checked)
        "
      />
    </FilterGroup>
    <template v-if="filter.type === 'attributes'">
      <FilterGroup
        v-if="filter.slug === 'color'"
        :badge="appliedAttributeValues[filter.slug]?.length"
        :label="filter.name"
        :class="{ 'border-t': index !== 0 }"
        class="pb-9 xl:pb-9"
        @click:reset="$emit('reset', filter.slug)"
      >
        <div class="flex flex-wrap gap-4">
          <template v-for="item in filter.values">
            <FilterColorChip
              v-if="getColorCodeById(item.id)"
              :key="item.id"
              data-testid="filter-color-circle"
              :color="item"
              :is-checked="
                appliedAttributeValues[filter.slug]?.includes(item.id)
              "
              @change="$emit('applyAttributeFilter', filter.slug, item.id)"
            >
              {{ item.name }}
            </FilterColorChip>
          </template>
        </div>
      </FilterGroup>
      <FilterGroup
        v-else-if="filter.slug === 'size'"
        :badge="appliedAttributeValues[filter.slug]?.length"
        :label="filter.name"
        :class="{ 'border-t': index !== 0 }"
        @click:reset="$emit('reset', filter.slug)"
      >
        <div class="flex flex-wrap items-start gap-4">
          <SFChip
            v-for="item in filter.values"
            :key="item.id"
            :model-value="appliedAttributeValues[filter.slug]"
            :item="item.id"
            :label="item.name"
            @change="$emit('applyAttributeFilter', filter.slug, item.id)"
          >
            {{ item.name }}
          </SFChip>
        </div>
      </FilterGroup>
      <FilterGroup
        v-else
        :badge="appliedAttributeValues[filter.slug]?.length"
        :label="filter.name"
        :class="{ 'border-t': index !== 0 }"
        @click:reset="$emit('reset', filter.slug)"
      >
        <div class="flex flex-col gap-2">
          <SFCheckbox
            v-for="item in filter.values"
            :id="item.name"
            :key="item.id"
            :model-value="appliedAttributeValues[filter.slug]"
            :item="item.id"
            :label="item.name"
            @change="$emit('applyAttributeFilter', filter.slug, item.id)"
          />
        </div>
      </FilterGroup>
    </template>
  </template>
</template>

<script setup lang="ts">
import type { CentAmount, ProductSearchQuery } from '@scayle/storefront-nuxt'
import SortSelection from '../sorting/SortSelection.vue'
import FilterColorChip from './FilterColorChip.vue'
import FilterGroup from './FilterGroup.vue'
import type { FilterItemWithValues } from '~/types/filter'
import type { RangeTuple } from '#storefront-ui/components/form/RangeSlider.vue'
import { getColorCodeById } from '~/utils'
import { SFCheckbox, SFChip, SFRangeSlider } from '#storefront-ui/components'

type Props = {
  availableFilters: FilterItemWithValues[]
  appliedAttributeValues: Record<string, number[]>
  appliedBooleanValues: Record<string, boolean>
  appliedFilter: ProductSearchQuery
}

const props = defineProps<Props>()

defineEmits<{
  resetPriceFilter: []
  applyPriceFilter: [RangeTuple]
  applyBooleanFilter: [string, boolean]
  reset: [string]
  applyAttributeFilter: [string, number]
}>()

const getPriceRange = (
  currentMin: CentAmount,
  currentMax: CentAmount,
): RangeTuple => {
  const appliedMin = props.appliedFilter.minPrice
  const appliedMax = props.appliedFilter.maxPrice

  const min = Math.max(currentMin, appliedMin ?? currentMin, 0)
  const max = Math.min(currentMax, appliedMax ?? currentMax)

  return [min, max]
}
</script>
