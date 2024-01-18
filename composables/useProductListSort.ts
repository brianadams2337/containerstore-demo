import {
  type SortValue,
  type Category,
  getSortByValue,
  getSortingValues,
} from '@scayle/storefront-nuxt'

export const DEFAULT_SORTING_KEY = 'dateNewest'

export function useProductListSort(
  selectedCategory?: MaybeRefOrGetter<Category | undefined>,
) {
  const route = useRoute()
  const category = toRef(selectedCategory)

  const customDefaultSorting = computed(() => {
    return category.value?.shopLevelCustomData?.defaultSorting
  })

  const selectedSort = computed(() => {
    if (route.query.sort || !customDefaultSorting.value) {
      return getSortByValue(
        route.query.sort || '',
        DEFAULT_SORTING_KEY,
      ) as SortValue
    }
    return getSortByValue(customDefaultSorting.value)
  })

  const sortingValues = Object.values(getSortingValues())

  return {
    customDefaultSorting,
    selectedSort,
    sortingValues,
  }
}
