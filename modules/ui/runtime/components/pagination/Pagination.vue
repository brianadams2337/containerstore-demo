<template>
  <div
    v-if="lastPage !== 1"
    class="flex flex-row items-stretch justify-center space-x-2"
  >
    <slot v-bind="{ canNavigateLeft, previousPage }" name="previous-button">
      <SFPaginationButton v-if="canNavigateLeft" :page="previousPage">
        <IconArrowLeft class="size-3" />
      </SFPaginationButton>
    </slot>

    <slot
      name="first-page-button"
      v-bind="{ canNavigateLeft, previousPage, showFirst }"
    >
      <SFPaginationButton v-if="showFirst" :page="firstPage">
        {{ firstPage }}
      </SFPaginationButton>
    </slot>

    <slot v-if="showFirstDots" name="page-dots">
      <div class="p-3">...</div>
    </slot>

    <slot name="page-buttons" v-bind="{ limitedPageNumbers, currentPage }">
      <SFPaginationButton
        v-for="page in limitedPageNumbers"
        :key="page"
        :is-active="currentPage === page"
        :page="page"
      >
        {{ page }}
      </SFPaginationButton>
    </slot>

    <slot v-if="showLastDots" name="page-dots">
      <div class="p-3">...</div>
    </slot>

    <slot name="last-page-button" v-bind="{ lastPage, showLast }">
      <SFPaginationButton v-if="showLast" :page="lastPage">
        {{ lastPage }}
      </SFPaginationButton>
    </slot>

    <slot name="next-button" v-bind="{ canNavigateRight, nextPage }">
      <SFPaginationButton v-if="canNavigateRight" :page="nextPage">
        <IconArrowRight class="size-3" />
      </SFPaginationButton>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { usePagination } from '../../composables/usePagination'

type Props = {
  firstPage: number
  currentPage: number
  lastPage: number
  visible?: number
}
const props = withDefaults(defineProps<Props>(), { visible: 5 })

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
