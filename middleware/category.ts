import { navigateTo, defineNuxtRouteMiddleware } from '#app/composables/router'
import { useRouteHelpers } from '~/composables'
import { useCategoryById } from '#storefront/composables'
import { getCategoryId } from '~/utils/route'
import { globalGetCachedData } from '~/utils/useRpc'

export default defineNuxtRouteMiddleware(
  async ({ params, query, path, hash }) => {
    const { buildCategoryPath } = useRouteHelpers()
    const categoryId = getCategoryId(params)

    // We use the same option as on the PLP together with `globalGetCachedData` in order to share data between this middleware and the PLP.
    // This helps reducing network requests on client navigation.
    const { data: category } = await useCategoryById(
      {
        params: {
          id: categoryId,
          children: 0,
          properties: { withName: ['sale'] },
        },
        options: {
          dedupe: 'defer',
          getCachedData: globalGetCachedData,
        },
      },
      `current-category-${categoryId}`,
    )

    if (!category.value) {
      return
    }

    const expectedPath = buildCategoryPath(category.value)

    if (expectedPath === path) {
      return
    }

    return navigateTo(
      { path: expectedPath, query, hash },
      { redirectCode: 301 },
    )
  },
)
