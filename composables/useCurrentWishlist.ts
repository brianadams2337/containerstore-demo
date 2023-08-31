import { WISHLIST_WITH } from '~/constants/withParams'

export default async () => {
  /**
   * Provide promotion key: `with: { ...WISHLIST_WITH, pricePromotionKey },`
   */
  return await useWishlist(WISHLIST_WITH, { immediate: true })
}
