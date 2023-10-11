<template>
  <SlideIn
    name="FilterSlideIn"
    slide-class="mt-[7rem] border-t border-l border-primary xl:inset-y-0"
    @open="onSlideInOpen"
    @close="trackFilterFlyout('close', 'true')">
    <template #slideInHeader="{ toggle: toggleItem }">
      <div class="flex w-full items-center justify-between">
        <Headline size="xl" tag="p">{{ $t('filter.title') }} </Headline>
        <AppButton
          type="ghost"
          size="xs"
          data-test-id="closeCross"
          @click="toggleItem">
          <template #icon="{ _class }">
            <IconClose :class="_class" />
          </template>
        </AppButton>
      </div>
    </template>
    <template #slideInBody>
      <FilterSlideInBody :active-filters="activeFilters" :filters="filters" />
      <div>Hallo</div>
    </template>

    <template #slideInActions>
      <div class="grid grid-cols-2 gap-2">
        <AppButton
          data-test-id="reset-filter-button"
          type="tertiary"
          class="text-sm !capitalize"
          @click="resetFilters"
          >{{ $t('filter.reset_all') }}
        </AppButton>
        <AppButton
          data-test-id="apply-filter-button"
          is-full-width
          type="primary"
          class="text-sm !capitalize"
          @click="applyFilters">
          {{
            filteredCount !== unfilteredCount
              ? $t('filter.show_results_count', { count: filteredCount })
              : $t('filter.show_results')
          }}
        </AppButton>
      </div>
    </template>
  </SlideIn>
</template>

<script setup lang="ts">
import { Filter, ProductFilter } from '@scayle/storefront-nuxt'

const props = defineProps({
  filters: {
    type: Array as PropType<ProductFilter[]>,
    default: () => [],
  },
  activeFilters: {
    type: Object as PropType<Filter>,
    default: () => {},
  },
  filteredCount: {
    type: Number,
    default: 0,
  },
  unfilteredCount: {
    type: Number,
    default: 0,
  },
  fetchingFilteredCount: {
    type: Boolean,
    default: false,
  },
})

const { filters: filterableValues, activeFilters } = toRefs(props)

const emit = defineEmits<{
  (e: 'filter:apply', filter: Record<string, any>): void
  (e: 'filter:state-changed', filter: Record<string, any>): void
  (e: 'filter:reset'): void
}>()

const { onSlideInOpen, trackFilterFlyout, resetFilters, applyFilters } =
  useFilterSlideIn({
    filterableValues,
    activeFilters,
    onFilterApply: (filter) => emit('filter:apply', filter),
    onFilterReset: () => emit('filter:reset'),
    onStateChange: (filter) => emit('filter:state-changed', filter),
  })
</script>
