<template>
  <AppMenu>
    <template #label="{ toggle }">
      <div class="flex justify-end">
        <AppButton
          data-test-id="sorting-button"
          type="tertiary"
          size="sm"
          @click="toggle"
        >
          {{ $t(`sorting_select.${selected}`) }}
          <template #icon="{ _class }">
            <IconUpdown :class="_class" />
          </template>
        </AppButton>
      </div>
    </template>

    <template #menuContent="{ close }">
      <FadeInTransition>
        <div
          class="mt-2 min-w-48 max-w-[6.25rem] bg-white px-4 pb-5 pt-3 shadow"
          data-test-id="sorting-options-container"
        >
          <SortingItemsList
            :items="values"
            :selected="selected"
            class="w-full space-y-2"
            @click:item="selectSorting($event, close)"
          />
        </div>
      </FadeInTransition>
    </template>
  </AppMenu>
</template>

<script setup lang="ts">
import type { SortValue } from '@scayle/storefront-nuxt'

defineProps({
  values: {
    type: Array as PropType<SortValue[]>,
    required: true,
  },
  selected: {
    type: String,
    default: '',
  },
})
const { trackFilterApply } = useTrackingEvents()

const trackSort = ({ name }: SortValue): void => trackFilterApply('sort', name)

const selectSorting = (sorting: SortValue, close: () => void) => {
  trackSort(sorting)
  close()
}
</script>
