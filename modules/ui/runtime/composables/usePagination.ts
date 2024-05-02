import { computed } from 'vue'

export type PaginationOptions = Record<
  'firstPage' | 'currentPage' | 'lastPage' | 'visiblePages',
  Ref<number>
>

export function usePagination({
  visiblePages,
  firstPage,
  currentPage,
  lastPage,
}: PaginationOptions) {
  const pageNumbersList = computed(() =>
    Array.from(Array(lastPage.value), (_, i) => i + 1),
  )

  const limitedPageNumbers = computed(() => {
    // in case of very limited number
    if (lastPage.value < visiblePages.value) {
      return pageNumbersList.value
    }

    // left side of possible range
    if (
      currentPage.value <
      visiblePages.value - Math.floor(visiblePages.value / 2) + 1
    ) {
      return pageNumbersList.value.slice(0, visiblePages.value)
    }

    // right side of possible range
    if (
      currentPage.value >
      lastPage.value - Math.floor(visiblePages.value / 2)
    ) {
      return pageNumbersList.value.slice(lastPage.value - visiblePages.value)
    }

    // in between
    return pageNumbersList.value.slice(
      currentPage.value - Math.ceil(visiblePages.value / 2),
      currentPage.value + Math.floor(visiblePages.value / 2),
    )
  })

  const firstVisiblePageNumber = computed(() => limitedPageNumbers.value[0])
  const lastVisiblePageNumber = computed(
    () => limitedPageNumbers.value[limitedPageNumbers.value.length - 1],
  )

  return {
    limitedPageNumbers,
    pageNumbersList,
    previousPage: computed(() => Math.max(currentPage.value - 1, 1)),
    nextPage: computed(() => Math.min(currentPage.value + 1, lastPage.value)),
    showFirst: computed(() => firstVisiblePageNumber.value > firstPage.value),
    showFirstDots: computed(
      () => firstVisiblePageNumber.value > firstPage.value + 1,
    ),
    showLast: computed(() => lastVisiblePageNumber.value < lastPage.value),
    showLastDots: computed(
      () => lastVisiblePageNumber.value < lastPage.value - 1,
    ),
    canNavigateLeft: computed(() => currentPage.value !== firstPage.value),
    canNavigateRight: computed(() => currentPage.value !== lastPage.value),
  }
}
