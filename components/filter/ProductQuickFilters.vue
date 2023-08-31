<template>
  <div class="mt-3 flex w-full items-center space-x-4 overflow-x-auto">
    <template v-if="loading">
      <slot name="loading" v-bind="loading">
        <SkeletonLoader
          v-for="n in filters.length + 1"
          :key="n"
          type="button" />
      </slot>
    </template>
    <template v-else>
      <slot name="body" v-bind="{ totalCount, isActiveFilter }">
        <slot name="default" v-bind="{ totalCount, isActiveFilter }">
          <AppButton
            class="text-sm"
            data-test-id="totalCount"
            :badge="totalCount"
            type="tertiary"
            size="sm"
            @click="emit('click:selected-filter')">
            <slot name="filters-button-default-label">
              {{ $t('filter.all_label') }}
            </slot>
          </AppButton>
        </slot>

        <slot
          v-for="(filter, idx) in filters"
          name="buttons"
          v-bind="{
            filter,
            totalCount,
            isActiveFilter,
          }">
          <AppButton
            :key="idx"
            class="text-sm"
            :badge="filter.count"
            type="tertiary"
            size="sm"
            @click="
              emit('click:selected-filter', { [filter.key]: filter.value })
            ">
            {{ filter.displayName }}
          </AppButton>
        </slot>
      </slot>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  filters: {
    type: Array as PropType<Array<any>>,
    default: () => [],
  },
  totalCount: {
    type: Number as PropType<number>,
    default: 0,
  },
  isActiveFilter: {
    type: Function as PropType<(filter?: any) => boolean>,
    default: () => false,
  },
})

const emit = defineEmits<{
  (e: 'click:selected-filter', value?: any): void
}>()
</script>
