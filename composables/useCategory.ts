const STORYBLOK_CATEGORIES_FOLDER = '/categories'
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

  if (categoryPath.value.startsWith(`${STORYBLOK_CATEGORIES_FOLDER}/`)) {
    const id = parseInt(
      categoryPath.value.replace(`${STORYBLOK_CATEGORIES_FOLDER}/`, ''),
    )
    const { fetch, data: categoryById } = await useCategoryById({
      params: { id },
      key: 'category',
      options: { autoFetch },
    })

    return { category: categoryById, categoryPath, fetch }
  }

  const { data: category, fetch } = await useCategoryByPath({
    params: { path: categoryPath.value, children: 0 },
    key: 'category',
    options: { autoFetch },
  })

  return { category, categoryPath, fetch }
}
