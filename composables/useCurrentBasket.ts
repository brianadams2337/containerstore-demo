import { BASKET_WITH } from '~/constants/withParams'

export default async () => {
  const basket = await useBasket(
    BASKET_WITH,
    // Provide promotion key: `with: { ...BASKET_WITH, pricePromotionKey },`
    { immediate: true },
  )

  const removeItem = async (lookup: { variantId: number }) => {
    const item = basket.findItem(lookup)
    if (!item) {
      throw new Error('Item not found')
    }
    await basket.removeItem(lookup)
    // TODO: Add tracking later
  }

  return {
    ...basket,
    removeItem,
    count: basket.countWithoutSoldOutItems,
  }
}
