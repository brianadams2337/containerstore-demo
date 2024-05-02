<template>
  <div class="mt-3 flex w-full items-center space-x-4 overflow-x-auto">
    <template v-if="loading">
      <slot name="loading" v-bind="{ loading }">
        <SFSkeletonLoader
          v-for="n in filters.length + 1"
          :key="n"
          type="button"
        />
      </slot>
    </template>
    <template v-else>
      <slot name="body" v-bind="{ totalCount }">
        <slot name="default" v-bind="{ totalCount }">
          <SFButton
            class="text-sm"
            data-test-id="totalCount"
            :badge="totalCount"
            type="tertiary"
            size="sm"
            @click="onFilterApply()"
          >
            <slot name="filters-button-default-label">
              {{ $t('filter.all_label') }}
            </slot>
          </SFButton>
        </slot>
        <slot
          v-for="(filter, idx) in filters"
          name="buttons"
          v-bind="{ filter, totalCount }"
        >
          <SFButton
            :key="idx"
            class="text-sm"
            :badge="filter.count"
            type="tertiary"
            size="sm"
            @click="onFilterApply({ [filter.key]: filter.value })"
          >
            {{ filter.displayName }}
          </SFButton>
        </slot>
      </slot>
    </template>
  </div>
</template>

<script setup lang="ts">
const {
  applyFilters,
  quickFilters: filters,
  unfilteredCount: totalCount,
  filtersFetching: loading,
} = useFilter()

const onFilterApply = (filters?: Record<string, any>) => {
  applyFilters({
    preserveAttributeFilters: true,
    ...(filters && { quickFilters: filters }),
    shouldToggle: false,
  })
}
</script>
