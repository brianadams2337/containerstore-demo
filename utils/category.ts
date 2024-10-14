import type { Category } from '@scayle/storefront-nuxt'

export const getCategoryAncestors = (
  category: Category,
  categories: Category[] = [],
): Category[] => {
  if (!category?.parent) {
    return categories
  }
  return [...getCategoryAncestors(category.parent, categories), category.parent]
}

export const isSaleCategory = (category: Category) => {
  return category.properties.some(({ name }) => name === 'sale')
}

export const flattenCategoryTree = (categoryTree: Category[]): Category[] => {
  const flattenedCategoryTreeList = categoryTree.reduce<Category[]>(
    (categories, categoryNode) => {
      const children = categoryNode?.children ?? []
      return categories.concat(categoryNode, ...flattenCategoryTree(children))
    },
    [],
  )

  // Filter and return unique entries
  return [
    ...new Map(
      flattenedCategoryTreeList.map((item) => [item?.id ?? item, item]),
    ).values(),
  ]
}
