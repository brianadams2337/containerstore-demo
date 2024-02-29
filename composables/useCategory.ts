export async function useCategory(autoFetch = false) {
  const route = useRoute()

  const categoryPath = computed<string>(() => {
    const { category } = route.params
    if (!category) {
      return '/'
    }
    const path = Array.isArray(category) ? category.join('/') : category
    return normalizePathRoute(path)
  })

  const { data: category, fetch } = await useCategoryByPath({
    params: { path: categoryPath.value, children: 0 },
    key: 'category',
    options: { autoFetch },
  })

  return { category, categoryPath, fetch }
}
