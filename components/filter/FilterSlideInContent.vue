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
      <SFPriceRangeSlider
        :model-value="getPriceRange(filter.values[0].min, filter.values[0].max)"
        class="mt-10"
        :max="filter.values[0]?.max"
        :min="filter.values[0]?.min"
        @drag-end="
          handleApplyOrResetPriceFilterEmit(
            $event,
            filter.values[0].min,
            filter.values[0].max,
          )
        "
        @change="
          handleApplyOrResetPriceFilterEmit(
            $event,
            filter.values[0].min,
            filter.values[0].max,
          )
        "
      />
    </FilterGroup>
    <FilterGroup
      v-if="filter.type === 'boolean'"
      :class="{ 'border-t': index !== 0 }"
    >
      <SFSwitch
        :id="filter.slug"
        :model-value="appliedBooleanValues[filter.slug]"
        :label="getBooleanFilterLabel(filter)"
        @update:model-value="$emit('applyBooleanFilter', filter.slug, $event)"
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
              v-if="ProductColor[item.value]"
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
import type { RangeTuple } from '@scayle/storefront-product-listing'
import type {
  BooleanFilterItemWithValues,
  FilterItemWithValues,
} from '@scayle/storefront-api'
import SortSelection from '../sorting/SortSelection.vue'
import FilterColorChip from './FilterColorChip.vue'
import FilterGroup from './FilterGroup.vue'
import { ProductColor } from '~/constants/product'
import {
  SFCheckbox,
  SFSwitch,
  SFChip,
  SFPriceRangeSlider,
} from '#storefront-ui/components'
import { useI18n } from '#i18n'

type Props = {
  availableFilters?: FilterItemWithValues[]
  appliedAttributeValues: Record<string, (string | number)[]>
  appliedBooleanValues: Record<string, boolean>
  appliedFilter: ProductSearchQuery
}

const props = defineProps<Props>()

const emit = defineEmits<{
  resetPriceFilter: []
  applyPriceFilter: [RangeTuple]
  applyBooleanFilter: [string, boolean]
  reset: [string]
  applyAttributeFilter: [string, number]
}>()

const { t: $t } = useI18n()

/**
 * Emits an event based on whether the provided event values match the filter limits.
 * This ensures that the price filter can be reset even when the right / left slider
 * is at its highest position, addressing the issue where the filter would
 * otherwise remain applied.
 */
const handleApplyOrResetPriceFilterEmit = (
  event: RangeTuple,
  filterMin: number,
  filterMax: number,
) => {
  if (event[0] === filterMin && event[1] === filterMax) {
    emit('resetPriceFilter')
  } else {
    emit('applyPriceFilter', event)
  }
}

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

const getBooleanFilterLabel = ({ name, slug }: BooleanFilterItemWithValues) => {
  return slug !== 'sale' ? name : $t('filter.only_sale')
}
</script>
