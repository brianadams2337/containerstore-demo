import type { Category, ProductCategory } from '@scayle/storefront-nuxt'
import { useRouteHelpers } from '.'
import { useNuxtApp } from '#app'
import type { BreadcrumbItem } from '~/types/breadcrumbs'
import { getCategoryAncestors } from '~/utils/category'

export function useBreadcrumbs() {
  const { buildCategoryPath } = useRouteHelpers()
  const {
    $config: {
      public: { baseUrl },
    },
  } = useNuxtApp()

  const getBreadcrumbsFromProductCategories = (
    categories: ProductCategory[],
  ): BreadcrumbItem[] => {
    return categories.map((category) => ({
      value: category.categoryName,
      to: new URL(
        buildCategoryPath({
          id: category.categoryId,
          path: category.categoryUrl,
        }),
        baseUrl,
      ).href,
    }))
  }

  const getBreadcrumb = (category: Category) => ({
    to: new URL(buildCategoryPath(category), baseUrl).href,
    value: category.name,
  })

  const getBreadcrumbsFromCategory = (
    category: Category,
    includeActiveCategory = false,
  ): BreadcrumbItem[] => {
    const items = getCategoryAncestors(category).map(getBreadcrumb)
    return !includeActiveCategory ? items : [...items, getBreadcrumb(category)]
  }

  return {
    getBreadcrumb,
    getBreadcrumbsFromCategory,
    getBreadcrumbsFromProductCategories,
  }
}
