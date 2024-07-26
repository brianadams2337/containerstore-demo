import { extendPromise } from '@scayle/storefront-nuxt'
import { useCategoryById } from '#storefront/composables'

export function useCurrentCategory(id: number) {
  const categoryData = useCategoryById({
    key: `current-category-${id}`,
    params: {
      id,
      children: 0,
      properties: { withName: ['sale'] },
    },
  })

  return extendPromise(
    categoryData.then(() => ({})),
    categoryData,
  )
}
