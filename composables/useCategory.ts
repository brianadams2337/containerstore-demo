export async function useCategory() {
  const route = useRoute()

  const categoryPath = computed(() => {
    const { category } = route.params
    const path = Array.isArray(category) ? category.join('/') : category
    return normalizePathRoute(path)
  })

  const { data: category } = await useCategoryByPath({
    params: { path: categoryPath.value, children: 0 },
    key: 'category',
  })

  return { category, categoryPath }
}
