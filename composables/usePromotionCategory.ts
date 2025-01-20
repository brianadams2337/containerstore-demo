import { useCategoryById } from '#storefront/composables'

export function usePromotionCategory(id: number) {
  return useCategoryById(
    {
      params: {
        id,
        children: 0,
        properties: { withName: ['sale'] },
      },
    },
    `promotion-category-${id}`,
  )
}
