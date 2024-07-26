<template>
  <div class="flex flex-row justify-center">
    <div
      class="mx-4 flex h-14 max-w-full flex-row items-center justify-between gap-1 rounded-md border sm:gap-2 md:w-min"
    >
      <slot v-bind="{ canNavigateLeft, previousPage }" name="previous-button">
        <SFPaginationButton :disabled="!canNavigateLeft" :page="previousPage">
          <IconChevronLeft class="size-4" />
        </SFPaginationButton>
      </slot>

      <slot name="first-page" v-bind="{ firstPage }">
        <SFPaginationButton
          v-if="firstPage && isFirstOrLastPageButtonShown"
          :page="firstPage"
        />
      </slot>

      <slot name="first-dots">
        <div
          v-if="areFirstDotsShown"
          class="inline-flex h-full items-center border-t-2 border-transparent text-sm font-bold leading-none text-gray-500"
        >
          ...
        </div>
      </slot>

      <slot name="page-buttons" v-bind="{ limitedPages }">
        <template v-for="page in limitedPages" :key="page?.number">
          <SFPaginationButton v-if="page" :page="page" />
        </template>
      </slot>

      <slot name="second-dots">
        <div
          v-if="areSecondDotsShown"
          class="inline-flex h-full items-center border-t-2 border-transparent text-sm font-bold leading-none text-gray-500"
        >
          ...
        </div>
      </slot>

      <slot name="last-page" v-bind="{ lastPage }">
        <SFPaginationButton
          v-if="lastPage && isFirstOrLastPageButtonShown"
          :page="lastPage"
        />
      </slot>

      <slot name="next-button" v-bind="{ canNavigateRight, nextPage }">
        <SFPaginationButton
          v-if="nextPage"
          :disabled="!canNavigateRight"
          :page="nextPage"
        >
          <IconChevronRight class="size-4" />
        </SFPaginationButton>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue'
import { usePagination } from '#storefront-ui'

type Props = {
  totalPageCount: number
  visible?: number
}
const props = withDefaults(defineProps<Props>(), { visible: 6 })

const { visible, totalPageCount } = toRefs(props)
const {
  limitedPages,
  previousPage,
  nextPage,
  canNavigateLeft,
  canNavigateRight,
  areFirstDotsShown,
  areSecondDotsShown,
  firstPage,
  lastPage,
} = usePagination({
  totalPageCount,
  visiblePageNumbers: visible,
})

const isFirstOrLastPageButtonShown = computed(() => {
  return props.totalPageCount !== 1 && props.totalPageCount > props.visible
})
</script>
