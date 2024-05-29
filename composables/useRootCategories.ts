import { type Category, extendPromise } from '@scayle/storefront-nuxt'

export async function useRootCategories() {
  const categoryData = useCategories({
    params: { path: '/' },
    key: 'category-navigation',
  })

  const { data: rootCategoriesData, fetching: fetchingCategories } =
    categoryData

  const rootCategories = computed<Category[]>(() => {
    if (!rootCategoriesData.value) {
      return []
    }
    return Array.isArray(rootCategoriesData.value.categories)
      ? rootCategoriesData.value.categories
      : [rootCategoriesData.value.categories]
  })

  return extendPromise(
    categoryData.then(() => ({})),
    { fetchingCategories, rootCategories },
  )
}
