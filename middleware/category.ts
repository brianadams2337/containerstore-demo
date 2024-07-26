import { navigateTo, defineNuxtRouteMiddleware } from '#app/composables/router'
import { useCurrentCategory, useRouteHelpers } from '~/composables'
import { getCategoryId } from '~/utils/route'

export default defineNuxtRouteMiddleware(async ({ params, query, path }) => {
  const { buildCategoryPath } = useRouteHelpers()

  const { data: category } = await useCurrentCategory(getCategoryId(params))

  if (!category.value) return

  const expectedPath = buildCategoryPath(category.value)

  if (expectedPath === path) return

  return navigateTo({ path: expectedPath, query }, { redirectCode: 301 })
})
