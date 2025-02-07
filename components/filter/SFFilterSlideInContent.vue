<template>
  <SFFilterGroup class="md:hidden" :label="$t('filter.sorting')">
    <SFSortSelection />
  </SFFilterGroup>
  <template v-for="(filter, index) in availableFilters" :key="filter.slug">
    <SFFilterGroup
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
      @click-reset="$emit('resetPriceFilter')"
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
        @update:model-value="
          handleApplyOrResetPriceFilterEmit(
            $event,
            filter.values[0].min,
            filter.values[0].max,
          )
        "
      />
    </SFFilterGroup>
    <SFFilterGroup
      v-if="filter.type === 'boolean'"
      :class="{ 'border-t': index !== 0 }"
    >
      <SFSwitch
        :id="filter.slug"
        :model-value="appliedBooleanValues[filter.slug]"
        :label="getBooleanFilterLabel(filter)"
        @update:model-value="$emit('applyBooleanFilter', filter.slug, $event)"
      />
    </SFFilterGroup>
    <template v-if="filter.type === 'attributes'">
      <SFFilterGroup
        v-if="filter.slug === 'color'"
        :badge="appliedAttributeValues[filter.slug]?.length"
        :label="filter.name"
        :class="{ 'border-t': index !== 0 }"
        class="pb-9 xl:pb-9"
        @click-reset="$emit('reset', filter.slug)"
      >
        <div class="flex flex-wrap gap-4">
          <template v-for="item in filter.values">
            <SFFilterColorChip
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
            </SFFilterColorChip>
          </template>
        </div>
      </SFFilterGroup>
      <SFFilterGroup
        v-else-if="filter.slug === 'size'"
        :badge="appliedAttributeValues[filter.slug]?.length"
        :label="filter.name"
        :class="{ 'border-t': index !== 0 }"
        @click-reset="$emit('reset', filter.slug)"
      >
        <div class="flex flex-wrap items-start gap-4">
          <SFChip
            v-for="item in filter.values"
            :key="item.id"
            :model-value="appliedAttributeValues[filter.slug]"
            :item="item.id"
            :label="item.name"
            :input-aria-label="$t('filter.size', { size: item.name })"
            @change="$emit('applyAttributeFilter', filter.slug, item.id)"
          >
            {{ item.name }}
          </SFChip>
        </div>
      </SFFilterGroup>
      <SFFilterGroup
        v-else
        :badge="appliedAttributeValues[filter.slug]?.length"
        :label="filter.name"
        :class="{ 'border-t': index !== 0 }"
        @click-reset="$emit('reset', filter.slug)"
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
      </SFFilterGroup>
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
import SFSortSelection from '../sorting/SFSortSelection.vue'
import SFFilterColorChip from './SFFilterColorChip.vue'
import SFFilterGroup from './SFFilterGroup.vue'
import { ProductColor } from '~/constants/product'
import {
  SFCheckbox,
  SFSwitch,
  SFChip,
  SFPriceRangeSlider,
} from '#storefront-ui/components'
import { useI18n } from '#i18n'

const { appliedFilter } = defineProps<{
  availableFilters?: FilterItemWithValues[]
  appliedAttributeValues: Record<string, (string | number)[]>
  appliedBooleanValues: Record<string, boolean>
  appliedFilter: ProductSearchQuery
}>()

const emit = defineEmits<{
  resetPriceFilter: []
  applyPriceFilter: [range: RangeTuple]
  applyBooleanFilter: [slug: string, value: boolean]
  reset: [slug: string]
  applyAttributeFilter: [slug: string, value: number]
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
  const appliedMin = appliedFilter.minPrice
  const appliedMax = appliedFilter.maxPrice

  const min = Math.max(currentMin, appliedMin ?? currentMin, 0)
  const max = Math.min(currentMax, appliedMax ?? currentMax)

  return [min, max]
}

const getBooleanFilterLabel = ({ name, slug }: BooleanFilterItemWithValues) => {
  return slug !== 'sale' ? name : $t('filter.only_sale')
}
</script>
