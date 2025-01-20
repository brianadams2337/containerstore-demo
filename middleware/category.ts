import { navigateTo, defineNuxtRouteMiddleware } from '#app/composables/router'
import { useRouteHelpers } from '~/composables'
import { useRpcCall } from '#storefront/composables'
import { getCategoryId } from '~/utils/route'

export default defineNuxtRouteMiddleware(async ({ params, query, path }) => {
  if (import.meta.client) {
    return
  }

  const { buildCategoryPath } = useRouteHelpers()
  const getCategoryById = useRpcCall('getCategoryById')

  const category = await getCategoryById({
    id: getCategoryId(params),
    children: 0,
    properties: { withName: ['sale'] },
  }).catch(() => null)

  if (!category) {
    return
  }

  const expectedPath = buildCategoryPath(category)

  if (expectedPath === path) {
    return
  }

  return navigateTo({ path: expectedPath, query }, { redirectCode: 301 })
})
