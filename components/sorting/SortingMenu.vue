<template>
  <SFMenu>
    <template #label="{ toggle }">
      <div class="flex justify-end">
        <SFButton
          data-test-id="sorting-button"
          type="tertiary"
          size="sm"
          @click="toggle"
        >
          {{ $t(`sorting_select.${selected}`) }}
          <template #icon="{ _class }">
            <IconUpdown :class="_class" />
          </template>
        </SFButton>
      </div>
    </template>

    <template #menuContent="{ close }">
      <SFFadeInTransition>
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
      </SFFadeInTransition>
    </template>
  </SFMenu>
</template>

<script setup lang="ts">
import type { SortValue } from '@scayle/storefront-nuxt'
import { useTrackingEvents } from '~/composables'

type Props = {
  values: SortValue[]
  selected?: string
}

withDefaults(defineProps<Props>(), { selected: '' })

const { trackFilterApply } = useTrackingEvents()

const trackSort = ({ name }: SortValue): void => trackFilterApply('sort', name)

const selectSorting = (sorting: SortValue, close: () => void) => {
  trackSort(sorting)
  close()
}
</script>
