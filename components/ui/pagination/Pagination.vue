<template>
  <div
    v-if="lastPage !== 1"
    class="flex flex-row items-stretch justify-center space-x-2">
    <slot v-bind="{ canNavigateLeft, previousPage }" name="previous-button">
      <PaginationButton v-if="canNavigateLeft" :page="previousPage">
        <IconArrowLeft class="h-3 w-3" />
      </PaginationButton>
    </slot>

    <slot
      name="first-page-button"
      v-bind="{ canNavigateLeft, previousPage, showFirst }">
      <PaginationButton v-if="showFirst" :page="firstPage">
        {{ firstPage }}
      </PaginationButton>
    </slot>

    <slot v-if="showFirstDots" name="page-dots">
      <div class="p-3">...</div>
    </slot>

    <slot name="page-buttons" v-bind="{ limitedPageNumbers, currentPage }">
      <PaginationButton
        v-for="page in limitedPageNumbers"
        :key="page"
        :is-active="currentPage === page"
        :page="page">
        {{ page }}
      </PaginationButton>
    </slot>

    <slot v-if="showLastDots" name="page-dots">
      <div class="p-3">...</div>
    </slot>

    <slot name="last-page-button" v-bind="{ lastPage, showLast }">
      <PaginationButton v-if="showLast" :page="lastPage">
        {{ lastPage }}
      </PaginationButton>
    </slot>

    <slot name="next-button" v-bind="{ canNavigateRight, nextPage }">
      <PaginationButton v-if="canNavigateRight" :page="nextPage">
        <IconArrowRight class="h-3 w-3" />
      </PaginationButton>
    </slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  firstPage: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  lastPage: {
    type: Number,
    required: true,
  },
  visible: {
    type: Number,
    default: 5,
  },
})

const { visible, firstPage, currentPage, lastPage } = toRefs(props)
const {
  limitedPageNumbers,
  previousPage,
  nextPage,
  showFirst,
  showFirstDots,
  showLast,
  showLastDots,
  canNavigateLeft,
  canNavigateRight,
} = usePagination({
  firstPage,
  currentPage,
  lastPage,
  visiblePages: visible,
})
</script>

<script lang="ts">
export default {
  name: 'AppPagination',
}
</script>
