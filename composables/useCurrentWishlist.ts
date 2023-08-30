import { WISHLIST_WITH } from '~/constants/withParams'

export default () => {
  /**
   * Provide promotion key: `with: { ...WISHLIST_WITH, pricePromotionKey },`
   */
  return Promise.resolve(useWishlist(WISHLIST_WITH))
}
