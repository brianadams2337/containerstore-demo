<template>
  <SlideIn
    name="FilterSlideIn"
    slide-class="mt-[7rem] border-t border-l border-primary xl:inset-y-0"
    @open="onSlideInOpen"
    @close="trackFilterFlyout('close', 'true')"
  >
    <template #slideInHeader="{ toggle: toggleItem }">
      <div class="flex w-full items-center justify-between">
        <Headline size="xl" tag="p">{{ $t('filter.title') }} </Headline>
        <AppButton
          type="ghost"
          size="xs"
          data-test-id="closeCross"
          @click="toggleItem"
        >
          <template #icon="{ _class }">
            <IconClose :class="_class" />
          </template>
        </AppButton>
      </div>
    </template>
    <template #slideInBody>
      <FilterSlideInBody />
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
          @click="applyFilters()"
        >
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
const {
  onSlideInOpen,
  trackFilterFlyout,
  resetFilters,
  applyFilters,
  unfilteredCount,
  filteredCount,
} = await useFilter()
</script>
