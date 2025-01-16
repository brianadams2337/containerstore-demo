import { useCategoryById } from '#storefront/composables'

export function usePromotionCategory(id: number) {
  return useCategoryById(
    {
      params: {
        id,
        children: 0,
      },
    },
    `promotion-category-${id}`,
  )
}
