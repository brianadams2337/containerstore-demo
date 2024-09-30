<template>
  <SFDropdown
    data-testid="sort-dropdown"
    class="h-9 w-full md:w-[12.5rem]"
    :items="sortLinks"
  >
    <template #default>
      <span class="max-w-[80%] overflow-hidden text-ellipsis !text-base">
        {{ selectedSort.label }}
      </span>
    </template>
    <template #item="{ item, selectItem }">
      <SFLink
        data-testid="sort-item"
        type="whisper"
        class="mb-1 w-full rounded p-2 !text-base !font-medium last-of-type:mb-0 hover:bg-gray-100"
        :class="{ 'bg-gray-100 !text-black': item.key === selectedSort.key }"
        :to="item.to"
        @click="
          () => {
            selectItem(item)
            trackFilterApply('sort', item.key)
          }
        "
      >
        <span class="flex w-full items-center justify-between">
          {{ item.label }}
          <IconCheck
            v-if="item.key === selectedSort.key"
            class="size-4 text-accent"
          />
        </span>
      </SFLink>
    </template>
  </SFDropdown>
</template>

<script setup lang="ts">
import { useTrackingEvents, useProductListSort } from '~/composables'
import { SFDropdown, SFLink } from '#storefront-ui/components'

const { selectedSort, sortLinks } = useProductListSort()
const { trackFilterApply } = useTrackingEvents()
</script>
