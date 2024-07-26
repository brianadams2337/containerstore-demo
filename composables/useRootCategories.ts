import { computed } from 'vue'
import { type Category, extendPromise } from '@scayle/storefront-nuxt'
import { useCategories } from '#storefront/composables'
import { flattenCategoryTree } from '~/utils/category'

export function useRootCategories(
  options: {
    key?: string
    immediate?: boolean
    children?: number
  } = {},
) {
  const { immediate = true, children, key } = options

  const categoriesData = useCategories({
    params: {
      path: '/',
      ...(children && { children }),
      properties: { withName: ['sale'] },
    },
    options: { immediate },
    key: key ?? 'category-navigation',
  })

  const {
    data: rootCategoriesData,
    fetching: fetchingCategories,
    error,
  } = categoriesData

  const rootCategories = computed<Category[]>(() => {
    if (!rootCategoriesData.value) {
      return []
    }
    return Array.isArray(rootCategoriesData.value.categories)
      ? rootCategoriesData.value.categories
      : [rootCategoriesData.value.categories]
  })

  const allCategories = computed(() => {
    return flattenCategoryTree(rootCategories.value)
  })

  return extendPromise(
    categoriesData.then(() => ({})),
    {
      fetchingCategories,
      rootCategories,
      error,
      allCategories,
    },
  )
}
