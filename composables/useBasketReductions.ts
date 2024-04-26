import type { BasketItem } from '@scayle/storefront-nuxt'
import { hexToRGBAColor } from '~/utils/color'

export async function useBasketReductions() {
  const basket = await useBasket()

  function withNegativePrefix(value: string): string {
    return value.startsWith('-') ? value : `-${value}`
  }

  function getPromotionTextColor(color: unknown) {
    if (typeof color !== 'string') {
      return undefined
    }
    const fallbackColor = '#007aff'
    return hexToRGBAColor(color ?? fallbackColor, 100)
  }

  function getHeadlineParts(promotion: Promotion) {
    return promotion.customData.headlineParts?.at(0) ?? ''
  }
  function hasSaleReduction(item?: BasketItem) {
    if (!item) {
      return false
    }
    return item.price.total.appliedReductions.some(
      (reduction) => reduction.category === 'sale',
    )
  }
  function hasPromotionReduction(item?: BasketItem) {
    if (!item) {
      return false
    }
    return item.price.total.appliedReductions.some(
      (item) => item.category === 'promotion',
    )
  }

  const totalDiscount = computed(() => {
    const discounts = (basket.data.value?.cost.appliedReductions ?? []).map(
      ({ amount }) => amount.absoluteWithTax,
    )
    return _sum(discounts)
  })
  const totalCost = computed(() => basket.data.value?.cost.withTax)

  const totalCostWithoutReductions = computed(() => {
    const totalCostValue = totalCost.value?.valueOf() ?? 0
    return _sum([totalCostValue, totalDiscount.value])
  })

  function getBasketItemSalePrice(item: BasketItem) {
    return item.price.total.appliedReductions
      .filter((item) => item.category === 'sale')
      .reduce((accumulator, current) => {
        return accumulator + current.amount.absoluteWithTax
      }, 0)
  }

  const aggregatedSalePrice = computed(() => {
    const basketItemsWithSaleReductions = (basket.items.value ?? []).filter(
      hasSaleReduction,
    )
    const allSaleReductions = basketItemsWithSaleReductions.reduce<number[]>(
      (previous, next) => {
        const price = getBasketItemSalePrice(next)
        previous.push(price)
        return previous
      },
      [],
    )
    return _sum(allSaleReductions)
  })

  const itemsWithPromotionsReductions = computed(() => {
    return (basket.items.value ?? [])
      .filter(hasPromotionReduction)
      .reduce<{ promotion: BasketItem['promotion']; total: number }[]>(
        (previous, next) => {
          const existingPromotion = previous.find(
            (promo) => promo.promotion?.id === next.promotion?.id,
          )
          const price = next.price.total.appliedReductions
            .filter((item) => item.category === 'promotion')
            .reduce((accumulator, current) => {
              return accumulator + current.amount.absoluteWithTax
            }, 0)
          if (existingPromotion) {
            existingPromotion.total += price
            return previous
          } else {
            previous.push({
              promotion: next.promotion,
              total: price,
            })
            return previous
          }
        },
        [],
      )
  })

  const hasItemsWithSaleReductions = computed(
    () => aggregatedSalePrice.value !== 0,
  )

  const hasItemsWithPromotionReductions = computed(
    () => itemsWithPromotionsReductions.value.length > 0,
  )

  const totalSalesReductions = computed(() => {
    const discounts = (basket.cost.value?.appliedReductions ?? [])
      .filter((item) => item.category === 'sale')
      .map(({ amount }) => {
        return amount.absoluteWithTax
      })

    return _sum(discounts)
  })

  const totalPromotionsReductions = computed(() => {
    const discounts = (basket.data.value?.cost.appliedReductions ?? [])
      .filter((item) => item.category === 'promotion')
      .map(({ amount }) => amount.absoluteWithTax)
    return _sum(discounts)
  })

  return {
    totalCost,
    totalDiscount,
    hasItemsWithSaleReductions,
    hasItemsWithPromotionReductions,
    aggregatedSalePrice,
    itemsWithPromotionsReductions,
    totalCostWithoutReductions,
    totalSalesReductions,
    totalPromotionsReductions,
    getHeadlineParts,
    getBasketItemSalePrice,
    withNegativePrefix,
    hasSaleReduction,
    hasPromotionReduction,
    getPromotionTextColor,
  }
}
