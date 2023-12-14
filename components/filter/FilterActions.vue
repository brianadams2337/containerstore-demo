<template>
  <div class="grid grid-cols-2 gap-2">
    <AppButton
      data-test-id="reset-filter-button"
      type="tertiary"
      class="!capitalize"
      @click="resetFilters()"
    >
      {{ $t('filter.reset_all') }}
    </AppButton>
    <AppButton
      data-test-id="apply-filter-button"
      is-full-width
      class="!capitalize"
      @click="applyFilters()"
    >
      {{ showResultsLabel }}
    </AppButton>
  </div>
</template>

<script setup lang="ts">
const { $i18n } = useNuxtApp()
const { resetFilters, applyFilters, unfilteredCount, filteredCount } =
  useFilter()

const showResultsLabel = computed(() => {
  return filteredCount.value !== unfilteredCount?.value
    ? $i18n.t('filter.show_results_count', { count: filteredCount.value })
    : $i18n.t('filter.show_results')
})
</script>
