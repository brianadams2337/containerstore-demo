import { computed, type Ref } from 'vue'
import type { RouteLocationNamedRaw, RouteLocationRaw } from '#vue-router'
import { useRoute } from '#app/composables/router'

export type PaginationOptions = Record<
  'totalPageCount' | 'visiblePageNumbers',
  Ref<number>
>

export type Page = {
  number: number
  to: Partial<RouteLocationRaw>
  isActive: boolean
}

export function usePagination({
  visiblePageNumbers,
  totalPageCount,
}: PaginationOptions) {
  const route = useRoute()
  const currentPage = computed(() => (route.query.page ? +route.query.page : 1))

  const pageList = computed<Page[]>(() => {
    const list = Array.from({ length: totalPageCount.value }, (_, i) => i + 1)
    return list.map((page) => {
      const query: RouteLocationNamedRaw['query'] = {
        ...route.query,
        page: page.toString(),
      }

      if (page === 1) {
        delete query.page
      }

      return {
        number: page,
        to: {
          path: route.path,
          query,
        },
        isActive: currentPage.value === page,
      }
    })
  })

  const firstPage = computed(() => pageList.value[0])
  const lastPage = computed(() => pageList.value?.at(-1))

  const previousPage = computed(() => {
    return (
      pageList.value.find((page) => page.number === currentPage.value - 1) ||
      firstPage.value
    )
  })

  const nextPage = computed(() => {
    return (
      pageList.value.find((page) => page.number === currentPage.value + 1) ||
      lastPage.value
    )
  })

  const limitedPages = computed(() => {
    if (totalPageCount.value <= visiblePageNumbers.value) {
      return pageList.value
    }

    if (currentPage.value === 1) {
      return [pageList.value[1], pageList.value[2]]
    } else if (currentPage.value === totalPageCount.value) {
      return [
        pageList.value[pageList.value.length - 3],
        pageList.value[pageList.value.length - 2],
      ]
    }

    // Do not show previous/next page if its the first/last page
    const mergedPreviousPage =
      firstPage.value.number === previousPage.value.number
        ? []
        : [previousPage.value]
    const mergedNextPage =
      lastPage.value &&
      nextPage.value &&
      lastPage.value.number === nextPage.value.number
        ? []
        : [nextPage.value]

    return [
      ...mergedPreviousPage,
      pageList.value[currentPage.value - 1],
      ...mergedNextPage,
    ]
  })

  const areFirstDotsShown = computed(() => {
    if (totalPageCount.value <= visiblePageNumbers.value) {
      return false
    }
    const firstLimitedPage = limitedPages.value[0]

    if (!firstLimitedPage) {
      return false
    }

    return firstPage.value.number < firstLimitedPage.number - 1
  })

  const areSecondDotsShown = computed(() => {
    if (totalPageCount.value <= visiblePageNumbers.value) {
      return false
    }

    const lastLimitedPage = limitedPages.value?.at(-1)

    if (!lastLimitedPage) {
      return false
    }

    return totalPageCount.value > lastLimitedPage.number + 1
  })

  const canNavigateLeft = computed(() => currentPage.value !== 1)

  const canNavigateRight = computed(
    () => currentPage.value !== totalPageCount.value,
  )

  return {
    limitedPages,
    previousPage,
    nextPage,
    areFirstDotsShown,
    areSecondDotsShown,
    firstPage,
    lastPage,
    canNavigateLeft,
    canNavigateRight,
  }
}
